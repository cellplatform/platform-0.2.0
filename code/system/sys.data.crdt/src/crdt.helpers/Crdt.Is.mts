import { t, Is, Automerge } from './common';

/**
 * Flags
 */
export const CrdtIs = {
  /**
   * Determine if the given input is a [DocRef].
   */
  ref(input: any): input is t.CrdtDocRef<{}> {
    if (notObject(input)) return false;
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
    if (notObject(input)) return false;
    return (
      input.kind === 'Crdt:DocFile' &&
      CrdtIs.ref(input.doc) &&
      typeof input.exists === 'function' &&
      typeof input.save === 'function' &&
      typeof input.load === 'function'
    );
  },

  /**
   * Determine if the given input is a [DocSync].
   */
  sync(input: any): input is t.CrdtDocSync<{}> {
    if (notObject(input)) return false;
    return (
      input.kind === 'Crdt:DocSync' && CrdtIs.ref(input.doc) && typeof input.update === 'function'
    );
  },

  /**
   * Determine if the given input is a Lens.
   */
  lens(input: any): input is t.CrdtLens<{}, {}> {
    if (notObject(input)) return false;
    return (
      input.kind === 'Crdt:Lens' &&
      CrdtIs.ref(input.root) &&
      typeof input.change === 'function' &&
      typeof input.lens === 'function'
    );
  },

  /**
   * Determine if the given input is an [Automerge.Text] type.
   */
  text(input: any): input is Automerge.Text {
    if (notObject(input)) return false;
    return input instanceof Automerge.Text;
  },
};

/**
 * [Helpers]
 */

export function notObject(input: any) {
  return typeof input !== 'object' || input === null;
}
