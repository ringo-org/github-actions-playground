import { Validator } from './types';

export function runValidator(validator: Validator) {
    const changedFiles = (process.env.CHANGED_FILES || '')
        .split(' ')
        .map((x) => x.trim())
        .filter(Boolean);

    const results = validator.validate({ changedFiles });

    let hasError = false;

    for (const result of results) {
        console.error(`[${validator.name}] [${result.type.toUpperCase()}] ${result.message}`);
        if (result.type === 'error') hasError = true;
    }

    if (hasError) process.exit(1);

    console.log(`${validator.name} passed`);
}