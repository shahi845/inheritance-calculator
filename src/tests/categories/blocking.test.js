/**
 * blocking.test.js — Ḥajb (blocking) test suite.
 * Source: shafii/verified/blocking.test.js + asabah blocking cases
 */

import { blockingTests }     from '../shafii/verified/blocking.test.js';
import { shafiiAsabahTests } from '../shafii/strict/asabah.test.js';

export const suite = {
    name:   'Blocking (Ḥajb)',
    engine: 'shafii',
    tests:  [...blockingTests, ...shafiiAsabahTests],
};
