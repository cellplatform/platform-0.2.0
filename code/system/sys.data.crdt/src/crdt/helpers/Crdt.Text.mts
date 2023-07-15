import { t, Automerge } from './common';

export const CrdtText = {
  /**
   * NOTE: do this and assign to an object within a change callback.
   */
  init(initial?: string) {
    const res = new Automerge.Text();
    if (initial) res.insertAt(0, ...initial.split(''));
    return res;
  },

  /**
   * Apply a diff to the given text object.
   */
  update(text: t.AutomergeText, diff: t.TextCharDiff[]) {
    diff.forEach((change) => {
      const { index, value } = change;
      try {
        if (change.kind === 'Added') text.insertAt(index, value);
        if (change.kind === 'Deleted') text.deleteAt(index, value.length);
      } catch (error: any) {
        throw new Error(`Failed to update text from diff. ${error.message}`);
      }
    });
  },
};
