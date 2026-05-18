import { Validator }
from './core/types';
import { branchNameValidator } from './validator/branch-name-validator';
import { prTitleValidator } from './validator/pr-title-validator.ts';
import { textureValidator } from './validator/texture-validator';

const validators: Validator[] = [
  branchNameValidator,
  prTitleValidator,
  textureValidator,
];

let hasError = false;

for (const validator of validators) {
  const results =
    validator.validate();

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