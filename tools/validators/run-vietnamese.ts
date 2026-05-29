import * as fs from 'node:fs';

import {
    ValidationContext,
    ValidationResult,
    Validator,
} from '../core/types';
import { runValidator } from '../core/runner';

type LanguageProfile =
    Record<string, number>;

type DetectionResult = {
    isVietnamese: boolean;

    confidence: number;

    scores: {
        vietnamese: number;
        english: number;
    };
};

const TEXT_EXTENSIONS = [
    '.ts',
    '.js',
    '.json',
    '.txt',
    '.md',
];

const MIN_TEXT_LENGTH = 5;

const VI_PROFILE:
    LanguageProfile = JSON.parse(
        fs.readFileSync(
            'tools/config/vi-profile.json',
            'utf8',
        ),
    );

const EN_PROFILE:
    LanguageProfile = JSON.parse(
        fs.readFileSync(
            'tools/config/en-profile.json',
            'utf8',
        ),
    );

function normalizeText(
    text: string,
): string {

    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(
            /[\u0300-\u036f]/g,
            '',
        )
        .replace(
            /[^\p{L}\s]/gu,
            '',
        )
        .replace(/\s+/g, ' ')
        .trim();
}

function extractTrigrams(
    text: string,
): string[] {

    const trigrams:
        string[] = [];

    for (
        let i = 0;
        i < text.length - 2;
        i++
    ) {
        trigrams.push(
            text.slice(i, i + 3),
        );
    }

    return trigrams;
}

function buildProfile(
    text: string,
): LanguageProfile {

    const normalized =
        normalizeText(text);

    const trigrams =
        extractTrigrams(
            normalized,
        );

    const counts:
        Record<string, number> = {};

    for (const gram of trigrams) {

        counts[gram] ??= 0;

        counts[gram]++;
    }

    const total =
        trigrams.length;

    const frequencies:
        LanguageProfile = {};

    for (const gram in counts) {

        frequencies[gram] =
            counts[gram] / total;
    }

    return frequencies;
}

function similarity(
    input: LanguageProfile,
    profile: LanguageProfile,
): number {

    let score = 0;

    for (const gram in input) {

        if (profile[gram]) {

            score +=
                input[gram] *
                profile[gram];
        }
    }

    return score;
}

function detectVietnamese(
    text: string,
): DetectionResult {

    const inputProfile =
        buildProfile(text);

    const vietnameseScore =
        similarity(
            inputProfile,
            VI_PROFILE,
        );

    const englishScore =
        similarity(
            inputProfile,
            EN_PROFILE,
        );

    const total =
        vietnameseScore +
        englishScore;

    const confidence =
        total === 0
            ? 0
            : vietnameseScore /
            total;

    return {
        isVietnamese:
            vietnameseScore >
            englishScore,

        confidence: Number(
            confidence.toFixed(3),
        ),

        scores: {
            vietnamese: Number(
                vietnameseScore.toFixed(
                    6,
                ),
            ),

            english: Number(
                englishScore.toFixed(
                    6,
                ),
            ),
        },
    };
}

export const vietnameseValidator:
    Validator = {

    name: 'vietnamese-validator',

    validate({
        changedFiles,
    }: ValidationContext):
        ValidationResult[] {

        const results:
            ValidationResult[] = [];

        for (const file of changedFiles) {

            // only validate assets
            if (
                !file.startsWith(
                    'assets/',
                )
            ) {
                continue;
            }

            const ext =
                file.substring(
                    file.lastIndexOf(
                        '.',
                    ),
                );

            // ignore unsupported files
            if (
                !TEXT_EXTENSIONS
                    .includes(ext)
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

            // extract quoted strings
            const matches =
                content.match(
                    /(['"`])((?:\\.|(?!\1).)*)\1/g,
                ) || [];

            for (const raw of matches) {

                const text =
                    raw
                        .slice(1, -1)
                        .trim();

                // ignore short text
                if (
                    text.length <
                    MIN_TEXT_LENGTH
                ) {
                    continue;
                }

                const result =
                    detectVietnamese(
                        text,
                    );
                if (
                    result.isVietnamese && result.scores.vietnamese > 0.001
                ) {
                    results.push({
                        type: 'error',

                        message:
                            `[VIETNAMESE_DETECTED] `
                            + `${file}\n`
                            + `${text}\n`
                            + `confidence=${result.confidence}`,
                    });
                }
            }
        }

        return results;
    },
};

runValidator(vietnameseValidator);
