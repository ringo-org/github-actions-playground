import { runValidator } from "../core/runner";
import { Validator } from "../core/types";

const PR_REGEX =
/^\[(feature|fix|refactor|hotfix|docs)\]\s.+$/;

export const prTitleValidator: Validator = {
  name: 'pr-title-validator',

  validate() {
    const prTitle =
      (process.env.PR_TITLE || '').trim();

    if (!prTitle) {
      return [];
    }

    if (!PR_REGEX.test(prTitle)) {
      return [
        {
          type: 'error',
          message:
            `Invalid PR title: ${prTitle}`,
        },
      ];
    }

    return [];
  },
};

runValidator(prTitleValidator);