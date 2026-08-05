/**
 * dhawuAlArham.test.js — Dhawū al-Arḥām (distant kindred) test suite.
 *
 * Source: shafii/modern-fallback/distantKindred.test.js
 *
 * These tests require dhawuAlArhamMode = 'enabledWhenNoBaytulMal'.
 * Without this option the engine falls back to bayt al-māl,
 * so the suite options are set at the suite level.
 */

import { shafiiModernDistantKindredTests } from '../shafii/modern-fallback/distantKindred.test.js';

export const suite = {
    name:    'Dhawū al-Arḥām (Distant Kindred)',
    engine:  'shafii',
    options: { dhawuAlArhamMode: 'enabledWhenNoBaytulMal' },
    tests:   shafiiModernDistantKindredTests,
};
