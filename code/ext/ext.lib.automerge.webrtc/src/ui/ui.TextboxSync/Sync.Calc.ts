import { type t } from './common';

/**
 * Syncer for a text <input> element.
 */
export const Calc = {
  /**
   * TODO 🐷
   */
  diff(from: string, to: string, caret: t.Index) {
    const index = Calc.firstDiff(from, to);
    const delCount = from.length - index - (to.length - caret);
    const newText = to.slice(caret - (to.length - from.length), caret);
    return { index, delCount, newText } as const;
  },

  firstDiff(from: string, to: string) {
    let index = 0;
    while (index < from.length && index < to.length && from[index] === to[index]) {
      index++;
    }
    return index;
  },
} as const;
