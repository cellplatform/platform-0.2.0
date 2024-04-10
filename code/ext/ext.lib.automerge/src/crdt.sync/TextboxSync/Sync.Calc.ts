import { type t } from './common';

/**
 * Syncer for a text <input> element.
 */
export const Calc = {
  diff(from: string, to: string, caret: number): t.TextDiff {
    const index = wrangle.firstDiff(from, to);
    const commonSuffixLength = wrangle.commonSuffixLength(from, to, index);
    const delCount = from.length - index - commonSuffixLength;
    const newText = to.slice(index, caret);
    return { index, delCount, newText } as const;
  },
} as const;

/**
 * Helpers
 */
/**
 * Helpers
 */
const wrangle = {
  firstDiff(from: string, to: string) {
    let i = 0;
    while (i < from.length && i < to.length && from[i] === to[i]) {
      i++;
    }
    return i;
  },

  commonSuffixLength(from: string, to: string, index: number) {
    let i = 0;
    while (
      i < from.length - index &&
      i < to.length - index &&
      from[from.length - 1 - i] === to[to.length - 1 - i]
    ) {
      i++;
    }
    return i;
  },
} as const;
