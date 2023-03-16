import { t, Is, Automerge } from './common';

/**
 * Flags
 */
export const CrdtIs = {
  /**
   * Determine if the given input is a [DocRef].
   */
  ref(input: any): input is t.CrdtDocRef<{}> {
    if (typeof input !== 'object' || input === null) return false;
    return (
      input.kind === 'Crdt:DocRef' &&
      typeof input.change === 'function' &&
      Automerge.isAutomerge(input.current) &&
      Is.observable(input.$)
    );
  },

  /**
   * Determine if the given input is a [DocFile].
   */
  file(input: any): input is t.CrdtDocFile<{}> {
    if (typeof input !== 'object' || input === null) return false;
    return (
      input.kind === 'Crdt:DocFile' &&
      CrdtIs.ref(input.doc) &&
      typeof input.exists === 'function' &&
      typeof input.save === 'function' &&
      typeof input.load === 'function'
    );
  },

  /**
   * Determine if the given input is a [DocSync]..
   */
  sync(input: any): input is t.CrdtDocSync<{}> {
    if (typeof input !== 'object' || input === null) return false;
    return (
      input.kind === 'Crdt:DocSync' && CrdtIs.ref(input.doc) && typeof input.update === 'function'
    );
  },
};
