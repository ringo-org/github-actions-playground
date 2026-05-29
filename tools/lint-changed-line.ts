import { ESLint } from 'eslint';
import { getChangedLines } from './core/change-line';

const eslint = new ESLint();

const changedFiles = (process.env.CHANGED_FILES || '')
  .split(' ')
  .map(x => x.trim())
  .filter(Boolean)
  .filter(f => /^assets\/scripts\/.*\.ts$/.test(f));

if (changedFiles.length === 0) {
  console.log('No TS files changed');
  process.exit(0);
}

let hasError = false;

for (const file of changedFiles) {
  const changedLines = getChangedLines(file);

  for (const lineNumber of changedLines) {
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

    break;
  }
}

if (hasError) process.exit(1);