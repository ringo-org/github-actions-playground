const { ESLint } = require('eslint');
const { execSync } = require('child_process');

async function main() {
  const changedFiles = execSync(
    'git diff --name-only --diff-filter=ACMR origin/main...HEAD',
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(Boolean)
    .filter((f) => /^assets\/scripts\/.*\.ts$/.test(f));

  if (changedFiles.length === 0) {
    console.log('No TS files changed');
    return;
  }

  const eslint = new ESLint();
  let hasError = false;

  for (const file of changedFiles) {
    console.log(`Checking ${file}`);

    const diff = execSync(
      `git diff -U0 origin/main...HEAD -- "${file}"`,
      { encoding: 'utf8' }
    );

    // Parse chính xác từng dòng có dấu + thay vì dùng hunk header
    // Fix bug: hunk header +14,15 bao gồm cả context lines không thay đổi
    const changedLines = parseChangedLines(diff);

    if (changedLines.length === 0) {
      continue;
    }

    // Lint cả file để ESLint có đủ context (import, type, scope...)
    // Fix bug: lintText từng dòng riêng lẻ khiến nhiều rule bị sai hoặc bỏ sót
    const results = await eslint.lintFiles([file]);

    for (const result of results) {
      for (const msg of result.messages) {
        // Chỉ báo lỗi ở những dòng thực sự thay đổi
        if (!changedLines.includes(msg.line)) {
          continue;
        }

        const level = msg.severity === 2 ? 'error' : 'warning';

        console.error(
          `[${level}] ${file}:${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`
        );

        if (msg.severity === 2) {
          hasError = true;
        }
      }
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

/**
 * Parse các dòng thực sự được thêm/sửa trong diff
 * bằng cách đọc từng dòng có dấu + thay vì dùng hunk header range
 *
 * Ví dụ diff:
 * @@ -14,10 +14,15 @@        ← reset currentLine về 14
 *  console.log('unchanged'); ← context line, tăng currentLine, không push
 * -console.log('removed');   ← dòng xóa, không tăng currentLine
 * +var result = a + b;       ← dòng thêm, push currentLine rồi tăng
 */
function parseChangedLines(diff) {
  const changedLines = [];
  let currentLine = 0;

  for (const line of diff.split('\n')) {
    // Hunk header: reset vị trí dòng hiện tại
    if (line.startsWith('@@')) {
      const match = /\+(\d+)/.exec(line);
      if (match) {
        currentLine = Number(match[1]);
      }
      continue;
    }

    // Dòng bị xóa: không tồn tại trong file mới, không tăng currentLine
    if (line.startsWith('-')) {
      continue;
    }

    // Dòng được thêm: push vào changedLines rồi tăng currentLine
    if (line.startsWith('+')) {
      changedLines.push(currentLine);
      currentLine++;
      continue;
    }

    // Context line (không thay đổi): chỉ tăng currentLine, không push
    currentLine++;
  }

  return changedLines;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});