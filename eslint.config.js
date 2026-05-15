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

                // functions
                {
                    selector: 'function',
                    format: ['camelCase'],
                },

                // variables
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                },

                // parameters
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                },

                // class names
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],
        },
    },
];