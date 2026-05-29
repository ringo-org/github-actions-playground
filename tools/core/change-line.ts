import { execSync } from 'child_process';

export function getChangedLines(
  file: string,
): Set<number> {
  const diff = execSync(
    `git diff -U0 origin/main...HEAD -- "${file}"`,
    { encoding: 'utf8' },
  );

  const lines = new Set<number>();
  let currentLine = 0;

  for (const line of diff.split('\n')) {
    const hunk = line.match(
      /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/
    );

    if (hunk) {
      currentLine = Number(hunk[1]);
      continue;
    }

    if (line.startsWith('+') && !line.startsWith('+++')) {
      lines.add(currentLine);
      currentLine++;
      continue;
    }

    if (line.startsWith('-') && !line.startsWith('---')) {
      continue;
    }

    if (
      line.startsWith('diff ') ||
      line.startsWith('index ') ||
      line.startsWith('\\')
    ) {
      continue;
    }

    currentLine++;
  }

  return lines;
}