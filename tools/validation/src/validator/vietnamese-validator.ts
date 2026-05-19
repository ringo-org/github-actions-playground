import * as fs from 'fs';

import { franc }
    from 'franc-min';

import {
    ValidationContext,
    ValidationResult,
    Validator,
} from '../core/types';

const TEXT_EXTENSIONS = [
    '.ts',
    '.js',
    '.json',
    '.txt',
    '.md',
];

export const vietnameseValidator:
    Validator = {

    name: 'vietnamese-validator',

    validate({
        changedFiles,
    }: ValidationContext): ValidationResult[] {

        const results:
            ValidationResult[] = [];

        for (const file of changedFiles) {
            if (
                !file.startsWith('assets/')
            ) {
                continue;
            }
            const ext =
                file.substring(
                    file.lastIndexOf('.'),
                );

            if (
                !TEXT_EXTENSIONS.includes(ext)
            ) {
                continue;
            }

            if (
                !fs.existsSync(file)
            ) {
                continue;
            }


            const content =
                fs.readFileSync(
                    file,
                    'utf8',
                );

            // ignore tiny text
            if (
                content.length < 20
            ) {
                continue;
            }

            const language =
                franc(content);
console.log(`[vietnamese-validator] ${file}: detected language = ${language}`);
            if (
                language === 'vie'
            ) {
                const preview =
                    content
                        .replace(/\s+/g, ' ')
                        .slice(0, 120);

                results.push({
                    type: 'error',
                    message:
                        `[VIETNAMESE_DETECTED]

                            FILE:
                            ${file}

                            LANGUAGE:
                            ${language}

                            PREVIEW:
                            ${preview}`,
                });
            }
        }

        return results;
    },
};