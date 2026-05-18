export interface ValidationContext {
  branchName: string;
}

export interface ValidationResult {
  type: 'error' | 'warning';
  message: string;
}

export interface Validator {
  name: string;

  validate(
    context: ValidationContext
  ): ValidationResult[];
}