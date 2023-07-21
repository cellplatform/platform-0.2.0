import { type t } from '../common';

/**
 * Utilities for working with a single position ("cell") on a
 * Cartesian plane that is used to represent a "spreadsheet like" grid.
 */
export const SheetCell = {
  /**
   * TODO 🐷
   */
  // Address (A1..Z9)
  // Position (x,y)
  // column(x): 0-based index to column-1
  // row(y) → 0-based index to row-1

  /**
   * Convert an {x, y} position to an address (e.g., "A1").
   * NOTE:
   *    [x, y] are 0-based indexes, for example:
   *     → x.0 == column-1,
   *     → y.0 == row-1.
   */
  address(x: number, y: number): t.CellAddress {
    if (x < 0) throw new Error(`x is less than 0 (${x})`);
    if (y < 0) throw new Error(`y is less than 0 (${y})`);

    return '';
  },
} as const;
