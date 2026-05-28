const { ESLint } = require('eslint');
const fs = require('fs');
const { execSync } = require('child_process');

async function main() {
  const changedFiles = execSync(
    'git diff --name-only --diff-filter=ACMR origin/main...HEAD',
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(Boolean)
    .filter(f => /^assets\/scripts\/.*\.ts$/.test(f));

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

    const changedLines = new Set();

    const diffLines = diff.split('\n');

    let currentLine = 0;

    for (const line of diffLines) {

      const hunkMatch = line.match(
        /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/
      );

      if (hunkMatch) {
        currentLine = Number(hunkMatch[1]);
        continue;
      }

      // exact added line
      if (
        line.startsWith('+') &&
        !line.startsWith('+++')
      ) {
        changedLines.add(currentLine);
        currentLine++;
        continue;
      }

      // removed line
      if (
        line.startsWith('-') &&
        !line.startsWith('---')
      ) {
        continue;
      }

      // skip metadata
      if (
        line.startsWith('\\') ||
        line.startsWith('diff ') ||
        line.startsWith('index ')
      ) {
        continue;
      }

      // context line
      currentLine++;
    }
    console.log([...changedLines]);

    const source = fs.readFileSync(file, 'utf8');
    const lines = source.split('\n');

    for (const lineNumber of changedLines) {
      const line = lines[lineNumber - 1];

      if (!line || !line.trim()) {
        continue;
      }

      const results = await eslint.lintText(line, {
        filePath: file,
      });

      for (const result of results) {
        for (const msg of result.messages) {
          const level =
            msg.severity === 2 ? 'error' : 'warning';

          console.error(
            `[${level}] ${file}:${lineNumber}:${msg.column} ${msg.message} (${msg.ruleId})`
          );

          if (msg.severity === 2) {
            hasError = true;
          }
        }
      }
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});