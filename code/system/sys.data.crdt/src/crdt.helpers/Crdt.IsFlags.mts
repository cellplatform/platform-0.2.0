import { Automerge, Is, type t } from './common';

/**
 * Flags
 */
export const CrdtIs = {
  /**
   * Determine if the given input is a [DocRef].
   */
  ref(input: any): input is t.CrdtDocRef<{}> {
    return (
      isObject(input) &&
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
    return (
      isObject(input) &&
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
    return (
      isObject(input) &&
      input.kind === 'Crdt:DocSync' &&
      CrdtIs.ref(input.doc) &&
      typeof input.update === 'function'
    );
  },

  /**
   * Determine if the given input is a Lens.
   */
  lens(input: any): input is t.CrdtLens<{}, {}> {
    return (
      isObject(input) &&
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
    return isObject(input) && input instanceof Automerge.Text;
  },

  /**
   * Determine if the given input is an [Automerge.Counter] type.
   */
  counter(input: any): input is Automerge.Counter {
    return isObject(input) && input instanceof Automerge.Counter;
  },

  /**
   * Determine if the given input is a [CrdtFuncData].
   */
  funcData(input: any): input is t.CrdtFuncData {
    return isObject(input) && CrdtIs.counter(input.count) && typeof input.params === 'object';
  },
};

/**
 * [Helpers]
 */

function notObject(input: any) {
  return typeof input !== 'object' || input === null;
}

function isObject(input: any) {
  return !notObject(input);
}
