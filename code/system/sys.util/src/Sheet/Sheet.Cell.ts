import { type t } from '../common';

/**
 * Utilities for working with a single position ("cell") on a
 * Cartesian plane that is used to represent a "spreadsheet like" grid.
 *
 *    - Address   A1..Z9
 *    - Position  {x, y}   ← 0-based index to column-1, row-1, etc.
 *
 */
export const SheetCell = {
  /**
   * TODO 🐷
   * - column(x): 0-based index to column-1
   * - row(y) → 0-based index to row-1
   */

  /**
   * Convert an {x, y} position to an address (e.g., "A1").
   * NOTE:
   *    [x, y] are 0-based indexes, for example:
   *     → x.0 == column-1
   *     → y.0 == row-1
   */
  address(x: number, y: number): t.CellAddress {
    if (x < 0) throw new Error(`x is less than 0 (${x})`);
    if (y < 0) throw new Error(`y is less than 0 (${y})`);

    const column = {
      label: '',
      current: x + 1, // NB: Convert 0-indexed to 1-indexed.
    };

    while (column.current > 0) {
      let remainder = (column.current - 1) % 26;
      column.label = String.fromCharCode(65 + remainder) + column.label; // 65 is ASCII value for 'A'.
      column.current = Math.floor((column.current - 1) / 26);
    }

    // NB: Add 1 to y to convert from 0-indexed to 1-indexed row.
    return `${column.label}${y + 1}`;
  },
} as const;
