import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                {
                    selector: 'method',
                    format: ['camelCase'],
                },
            ],
             'no-console': 'error',
             '@typescript-eslint/no-unused-vars': 'error',
        },
    },
];