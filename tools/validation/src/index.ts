import {
  Validator,
} from './core/types';

import {
  branchNameValidator,
} from './validator/branch-name-validator';

import {
  metaValidator,
} from './validator/meta-validator';

import {
  prTitleValidator,
} from './validator/pr-title-validator.ts';

import {
  textureValidator,
} from './validator/texture-validator';

const changedFiles =
  (process.env.CHANGED_FILES || '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);

const validators: Validator[] = [
  branchNameValidator,
  prTitleValidator,
  textureValidator,
  metaValidator,
];

let hasError = false;

for (const validator of validators) {

  const results =
    validator.validate({
      changedFiles,
    });

  for (const result of results) {

    console.error(`
[${validator.name}]
[${result.type.toUpperCase()}]

${result.message}
`);

    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log('Validation passed');