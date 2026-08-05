/**
 * index.js — Master learning topics aggregator.
 *
 * Priority order:
 *  1. New modular topic files (fixedShares.js, blocking.js, awl.js, radd.js, grandfather.js, glossary.js)
 *  2. Remaining legacy topics from topics.js (residuary, grandmother, sisters, children, parents, spouses, dhawu-al-arham, munasakhat, madhhab-differences)
 *
 * Duplicates (same id) are removed so the modular file takes precedence.
 */

import { fixedSharesTopic } from './fixedShares.js';
import { blockingTopic } from './blocking.js';
import { awlTopic } from './awl.js';
import { raddTopic } from './radd.js';
import { grandfatherTopic } from './grandfather.js';
import { glossaryTopic } from './glossary.js';
import { LEARNING_TOPICS as legacyTopics } from './topics.js';

const MODULAR_IDS = ['fixed-shares', 'blocking', 'awl', 'radd', 'grandfather', 'glossary'];

export const ALL_LEARNING_TOPICS = [
    fixedSharesTopic,
    blockingTopic,
    awlTopic,
    raddTopic,
    grandfatherTopic,
    glossaryTopic,
    ...legacyTopics.filter(t => !MODULAR_IDS.includes(t.id))
];

/** Backward-compat alias — prefer ALL_LEARNING_TOPICS in new code. */
export { ALL_LEARNING_TOPICS as LEARNING_TOPICS };
