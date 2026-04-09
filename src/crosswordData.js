// Returns Variant A or Variant B based on env/url

import * as VariantA from './crosswordDataA.js';
import * as VariantB from './crosswordDataB.js';

// Default routing logic: 
// Can be overridden by query string ?variant=B or env format
export function getCrosswordVariant(variant = 'A') {
    if (variant === 'B') return VariantB;
    return VariantA; // Default
}

// By default, export variant A definitions so existing code works without refactor immediately,
// though ideally we refactor components to use getCrosswordVariant()
const DefaultVariant = VariantA;

export const ROWS = DefaultVariant.ROWS;
export const COLS = DefaultVariant.COLS;
export const GRID = DefaultVariant.GRID;
export const LABELS = DefaultVariant.LABELS;
export const ACROSS_CLUES = DefaultVariant.ACROSS_CLUES;
export const DOWN_CLUES = DefaultVariant.DOWN_CLUES;
export const PREFILLED = DefaultVariant.PREFILLED || {};
