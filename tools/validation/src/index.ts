import { branchNameValidator } from "./validator/branch-name-validator";
import { prTitleValidator } from "./validator/pr-title-validator.ts";


const branchName =
  (process.env.BRANCH_NAME || '').trim();

const prTitle =
  (process.env.PR_TITLE || '').trim();

const validators = [
  branchNameValidator,
  prTitleValidator,
];

let hasError = false;

for (const validator of validators) {
  const results = validator.validate({
    branchName,
    prTitle,
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