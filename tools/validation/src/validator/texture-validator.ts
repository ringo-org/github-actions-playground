import * as fs from 'fs';
import * as path from 'path';

import { imageSize }
  from 'image-size';

import {
  ValidationResult,
  Validator,
} from '../core/types';

import {
  SNAKE_CASE_REGEX,
} from '../config/rule';

const ALLOWED_IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
];

const IGNORE_EXTENSIONS = [
  '.meta',
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

    const files =
      walk('assets/textures');

    for (const file of files) {

      const fileName =
        path.basename(file);

      // ignore hidden files
      if (
        fileName.startsWith('.')
      ) {
        continue;
      }

      const ext =
        path.extname(file)
          .toLowerCase();

      // ignore .meta
      if (
        IGNORE_EXTENSIONS
          .includes(ext)
      ) {
        continue;
      }

      // invalid extension
      if (
        !ALLOWED_IMAGE_EXTENSIONS
          .includes(ext)
      ) {
        results.push({
          type: 'error',
          message:
            `[INVALID_TEXTURE_EXTENSION] ${file}`,
        });

        continue;
      }

      const pureFileName =
        path.basename(file, ext);

      // snake_case naming
      if (
        !SNAKE_CASE_REGEX
          .test(pureFileName)
      ) {
        results.push({
          type: 'error',
          message:
            `[INVALID_TEXTURE_NAME] ${file}`,
        });
      }

      const buffer =
        fs.readFileSync(file);

      const size =
        imageSize(buffer);

      const width =
        size.width || 0;

      const height =
        size.height || 0;

      // power of two
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

      // max resolution
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