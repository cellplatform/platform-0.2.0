import type * as t from './t';

/**
 * Helpers for calculating margins.
 */
export const Margin = {
  toArray(value: number): t.Margin {
    value = value ?? 0;
    return [value, value, value, value];
  },

  wrangle(input?: t.MarginInput, defaultMargin?: number): t.Margin {
    if (input === undefined) return Margin.toArray(defaultMargin ?? 0);
    if (typeof input === 'number') return Margin.toArray(input);
    if ((input as any).length === 0) return Margin.toArray(defaultMargin ?? 0);
    if (input.length === 1) return Margin.toArray(input[0]);
    if (input.length === 2) return [input[0], input[1], input[0], input[1]];
    return [input[0], input[1], input[2], input[3]];
  },
};
