import { Validator } from "../core/types";
import { runValidator } from '../core/runner';

const BRANCH_REGEX =
  /^(feature|fix|refactor|chore|hotfix|test|docs)\/[a-z0-9-_]+$/;

export const branchNameValidator: Validator = {
  name: 'branch-name-validator',

  validate() {
    const branchName =
      (process.env.BRANCH_NAME || '').trim();

    if (!branchName) {
      return [];
    }

    if (!BRANCH_REGEX.test(branchName)) {
      return [
        {
          type: 'error',
          message: `Invalid branch name: ${branchName}`,
        },
      ];
    }

    return [];
  },
};

runValidator(branchNameValidator);