import { ValidationResult, Validator } from '../core/types';
import { BRANCH_REGEX } from '../config/rule';

export const branchNameValidator: Validator = {
  name: 'branch-name-validator',

  validate(context): ValidationResult[] {
    const branchName = context.branchName;

    if (!BRANCH_REGEX.test(branchName)) {
      return [
        {
          type: 'error',
          message:
            `Invalid branch name: ${branchName}`,
        },
      ];
    }

    return [];
  },
};