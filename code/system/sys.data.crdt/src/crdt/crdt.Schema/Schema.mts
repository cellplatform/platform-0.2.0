import { Automerge } from './common';
import { DocRef } from '../crdt.DocRef';

/**
 * Tools for working with document schemas.
 */
export const CrdtSchema = {
  /**
   * Convert an initial object's document structure into a byte-array such that it
   * can be used to initialize a new CRDT document independenctly on different peer
   * prior to each peer knowing about each other.
   *
   * NOTE:
   *    For context on the problem being solved here, and the solution being
   *    employed see the [Automerge Docs] "Cookbook / Modelling Data" section on:
   *
   *      "Setting up an initial document structure"
   *       (circa March, 2023)
   *       https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
   */
  toByteArray<D extends {}>(initial: D, options: { typeDef?: string } = {}) {
    const doc = DocRef.init<D>('dummy-id', initial);
    const bytes = Automerge.getLastLocalChange(doc.current)!;
    const api = {
      /**
       * The initial commit as a byte-array [Uint8Array].
       */
      bytes,

      /**
       * File source-code.
       */
      get sourceFile() {
        const byteArray = bytes?.toString();

        const typeDef =
          options.typeDef ?? 'export type D = { count: number }; // <== 🐷 Change this.';

        const code = `
${typeDef}

/**
 * Initial CRDT Document state.
 * Generated via: Crdt.Doc.Schema.toByteArray(...)  ← (check into source-control).
 */
export const bytes = new Uint8Array([${byteArray}]);
`.substring(1);
        return code;
      },

      /**
       * File source-code.
       */
      toString() {
        return api.sourceFile;
      },
    };

    return api;
  },
};
