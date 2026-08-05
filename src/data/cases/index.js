/**
 * index.js — Master export and search/filter module for sample cases.
 */

import { shafiiCases } from './shafiiCases.js';
import { hanafiCases } from './hanafiCases.js';
import { malikiCases } from './malikiCases.js';
import { hanbaliCases } from './hanbaliCases.js';
import { differencesCases } from './differencesCases.js';

export const ALL_CASES = [
    ...shafiiCases,
    ...hanafiCases,
    ...malikiCases,
    ...hanbaliCases,
    ...differencesCases
];

/**
 * Filter cases by madhhab and/or category.
 * @param {string} [madhhab] — 'all' | 'shafii' | 'hanafi' | 'maliki' | 'hanbali' | 'jumhur'
 * @param {string} [category] — 'all' | 'basic' | 'awl' | 'radd' | 'blocking' | 'grandfather' | 'special'
 * @param {string} [searchQuery] — search string
 * @returns {Array} Matching cases
 */
export function getFilteredCases(madhhab = 'all', category = 'all', searchQuery = '') {
    return ALL_CASES.filter(c => {
        const matchesMadhhab = madhhab === 'all' || c.madhhab === madhhab;
        const matchesCategory = category === 'all' || c.category === category;
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery = !query ||
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.teachingNote.toLowerCase().includes(query) ||
            (c.tags && c.tags.some(t => t.toLowerCase().includes(query)));

        return matchesMadhhab && matchesCategory && matchesQuery;
    });
}
