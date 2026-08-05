/**
 * shafii/index.js — Modular Shāfiʿī sample cases aggregator.
 */

import { spousesCases } from './spouses.js';
import { parentsCases } from './parents.js';
import { childrenCases } from './children.js';
import { awlCases } from './awl.js';
import { grandfatherCases } from './grandfather.js';
import { shafiiCases } from '../shafiiCases.js';

export const shafiiCasesModular = [
    ...spousesCases,
    ...parentsCases,
    ...childrenCases,
    ...awlCases,
    ...grandfatherCases,
    ...shafiiCases
];
