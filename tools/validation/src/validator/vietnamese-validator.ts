import * as fs from 'fs';

import {
    franc,
} from 'franc-min';

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

            // only validate assets
            if (
                !file.startsWith('assets/')
            ) {
                continue;
            }

            const ext =
                file.substring(
                    file.lastIndexOf('.'),
                );

            // ignore unsupported files
            if (
                !TEXT_EXTENSIONS.includes(ext)
            ) {
                continue;
            }

            // ignore deleted files
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

            const lines =
                content.split('\n');

            for (const line of lines) {

                const trimmed =
                    line.trim();

                // ignore short lines
                if (
                    trimmed.length < 10
                ) {
                    continue;
                }

                const language =
                    franc(trimmed);

                    console.log(
                        `[${file}] Detected language: ${language} for line: ${trimmed}`,
                    );
                if (
                    language === 'vie'
                ) {
                    results.push({
                        type: 'error',
                        message:
                            `[VIETNAMESE_DETECTED] ${file}\n${trimmed}`,
                    });

                    break;
                }
            }
        }

        return results;
    },
};