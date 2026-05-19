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

                // methods
                {
                    selector: 'method',
                    format: ['camelCase'],
                },

                // allow destructuring
                {
                    selector: 'variable',
                    modifiers: ['destructured'],
                    format: null,
                },

                // normal variables
                {
                    selector: 'variable',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },

                // const variables
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: [
                        'UPPER_CASE',
                    ],
                    leadingUnderscore: 'allow',
                },

                // class / interface / type / enum
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],

            // forbid console.log
            'no-console': 'error',

            // unused variables
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
];