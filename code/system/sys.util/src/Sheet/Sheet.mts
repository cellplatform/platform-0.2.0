import { type t } from '../common';
import { SheetCell as Cell } from './Sheet.Cell.mjs';

/**
 * Utilities for working with a Cartesian plane (x,y) that
 * is used to represent a "spreadsheet like" grid of cells.
 */
export const Sheet = {
  Cell,
} as const;
