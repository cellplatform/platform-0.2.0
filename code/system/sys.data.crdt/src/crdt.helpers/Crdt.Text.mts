import { Automerge } from './common';

export const CrdtText = {
  /**
   * NOTE: do this and assign to an object within a change callback.
   */
  init() {
    return new Automerge.Text();
  },
};
