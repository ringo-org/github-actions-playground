import * as fs from 'fs';
import * as path from 'path';

import {
    ValidationContext,
    ValidationResult,
    Validator,
} from '../core/types';

export const metaValidator: Validator = {
    name: 'meta-validator',

    validate({
        changedFiles,
    }: ValidationContext): ValidationResult[] {

        const results:
            ValidationResult[] = [];

        for (const file of changedFiles) {

            const fileName =
                path.basename(file);

            // ignore hidden files
            if (
                fileName.startsWith('.')
            ) {
                continue;
            }

            // ignore meta files
            if (
                file.endsWith('.meta')
            ) {
                continue;
            }

            // ignore deleted files
            if (
                !fs.existsSync(file)
            ) {
                continue;
            }

            const metaFile =
                `${file}.meta`;

            if (
                !fs.existsSync(metaFile)
            ) {
                results.push({
                    type: 'error',
                    message:
                        `[MISSING_META] ${file}`,
                });
            }
        }

        return results;
    },
};