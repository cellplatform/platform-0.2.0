import { Automerge } from '../common/';

/**
 * Tools for working with an [Automerge] document.
 */
export const AutomergeDoc = {
  /**
   * Create a new Automerge document with an initial value.
   *
   * NOTE:
   *    A hack for initializing a new document with initial value provided
   *    by [Martin Kleppmann] within the Automerge slack channel.
   */
  init<D>(initialize: (doc: D) => void) {
    const { getLastLocalChange, init } = Automerge;
    const change = getLastLocalChange(Automerge.change(init('0000'), { time: 0 }, initialize));
    const [doc] = Automerge.applyChanges(Automerge.init<D>(), [change]);
    return doc;
  },
};
