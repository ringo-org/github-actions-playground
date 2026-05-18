import { PR_TITLE_REGEX } from "../config/rule";
import { ValidationResult, Validator } from "../core/types";

export const prTitleValidator: Validator = {
  name: 'pr-title-validator',

  validate(context): ValidationResult[] {
    const prTitle = context.prTitle;

    if (!PR_TITLE_REGEX.test(prTitle)) {
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