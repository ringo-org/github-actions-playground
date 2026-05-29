import { ESLint } from 'eslint';
import { getChangedLines } from './core/change-line';

const changedFiles = (process.env.CHANGED_FILES || '')
  .split(' ')
  .map(x => x.trim())
  .filter(Boolean)
  .filter(f => /^assets\/scripts\/.*\.ts$/.test(f));

async function main() {
  if (changedFiles.length === 0) {
    console.log('No TS files changed');
    return;
  }

  const eslint = new ESLint();
  let hasError = false;

  for (const file of changedFiles) {
    const changedLines = getChangedLines(file);

    if (changedLines.size === 0) continue;

    const results = await eslint.lintFiles([file]);

    for (const result of results) {
      for (const msg of result.messages) {
        if (!msg.ruleId) continue;
        if (!changedLines.has(msg.line)) continue;

        const level = msg.severity === 2 ? 'error' : 'warning';
        console.error(`[${level}] ${file}:${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`);

        if (msg.severity === 2) hasError = true;
      }
    }
  }

  if (hasError) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});