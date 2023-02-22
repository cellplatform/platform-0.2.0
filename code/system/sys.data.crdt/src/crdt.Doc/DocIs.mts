import { t, Is, Automerge } from './common';

/**
 * Flags
 */
export const DocIs = {
  /**
   * Determine if the given input is a [DocRef]
   */
  ref(input: any): input is t.CrdtDocRef<{}> {
    if (typeof input !== 'object' || input === null) return false;
    return (
      typeof input.change === 'function' &&
      Is.observable(input.$) &&
      Automerge.isAutomerge(input.current)
    );
  },

  /**
   * Determind if the given input is a [DocFile]
   */
  file(input: any): input is t.CrdtDocFile<{}> {
    if (typeof input !== 'object' || input === null) return false;
    return (
      DocIs.ref(input.doc) &&
      typeof input.exists === 'function' &&
      typeof input.save === 'function' &&
      typeof input.load === 'function'
    );
  },
};
