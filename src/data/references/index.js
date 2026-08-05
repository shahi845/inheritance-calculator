/**
 * index.js — Modular scriptural and classical references aggregator.
 */

import { quranReferences } from './quran.js';
import { hadithReferences } from './hadith.js';
import { shafiiReferences } from './shafii.js';
import { hanafiReferences } from './hanafi.js';
import { malikiReferences } from './maliki.js';
import { hanbaliReferences } from './hanbali.js';
import { REFERENCES_DATA } from './referencesData.js';

export const ALL_REFERENCES = [
    ...quranReferences,
    ...hadithReferences,
    ...shafiiReferences,
    ...hanafiReferences,
    ...malikiReferences,
    ...hanbaliReferences,
    ...REFERENCES_DATA
];
