export interface ValidationContext {
  changedFiles: string[];
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