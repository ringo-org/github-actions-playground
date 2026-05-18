import fs from 'fs';
import path from 'path';

import { imageSize }
from 'image-size';
import { ValidationResult, Validator } from '../core/types';

const IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
];

const MAX_TEXTURE_SIZE = 2048;

function isPowerOfTwo(value: number) {
  return (value & (value - 1)) === 0;
}

function walk(dir: string): string[] {
  let results: string[] = [];

  const entries =
    fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath =
      path.join(dir, entry);

    const stat =
      fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results =
        results.concat(walk(fullPath));

      continue;
    }

    results.push(fullPath);
  }

  return results;
}

export const textureValidator: Validator = {
  name: 'texture-validator',

  validate(): ValidationResult[] {
    const results: ValidationResult[] = [];

    const files = walk('assets');

    for (const file of files) {
      const ext =
        path.extname(file).toLowerCase();

      if (!IMAGE_EXTENSIONS.includes(ext)) {
        continue;
      }

      const buffer =
        fs.readFileSync(file);

      const size =
        imageSize(buffer);

      const width =
        size.width || 0;

      const height =
        size.height || 0;

      if (
        !isPowerOfTwo(width) ||
        !isPowerOfTwo(height)
      ) {
        results.push({
          type: 'error',
          message:
            `[POT] ${file} ${width}x${height}`,
        });
      }

      if (
        width > MAX_TEXTURE_SIZE ||
        height > MAX_TEXTURE_SIZE
      ) {
        results.push({
          type: 'error',
          message:
            `[SIZE] ${file} ${width}x${height}`,
        });
      }
    }

    return results;
  },
};