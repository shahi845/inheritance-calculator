/**
 * Ḥanbalī Dhawū al-Arḥām (Distant Kindred)
 *
 * Ḥanbalīs officially use the Tanzīl system (stepping into the shoes of the primary heir).
 * However, the order of priority (Classes 1-4) is generally similar to Qarābah in broad strokes.
 * For the purpose of this calculator, we reuse the robust 4-class system engine.
 */

import { _assignHanafiDhawuAlArham } from '../hanafi/dhawuAlArham.js';

export function assignHanbaliDhawuAlArham(shares, heirs, remainder, context) {
    context.messages.push("Ḥanbalī madhhab: Distributing surplus to Dhawū al-Arḥām.");
    return _assignHanafiDhawuAlArham(shares, heirs, remainder, context);
}
