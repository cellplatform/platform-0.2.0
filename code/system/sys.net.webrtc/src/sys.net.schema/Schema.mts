import { t, Crdt } from './common';
import { bytes, typeDef } from './Schema.bytes.mjs';

import type { DocShared } from './Schema.bytes.mjs';
export type { DocShared } from './Schema.bytes.mjs';

/**
 * Schema tools for the WebRTC peer network.
 */
export const NetworkSchema = {
  get initial() {
    const doc: DocShared = { count: 0, network: { peers: {} }, tmp: {} };
    return { doc, bytes };
  },

  /**
   * Generate an initial genesis object for the shared CRDT document.
   */
  genesis(options: { dispose$?: t.Observable<any> } = {}) {
    const initial = NetworkSchema.initial;
    const schema = Crdt.Doc.Schema.toByteArray<DocShared>(initial.doc, { typeDef });
    const doc = Crdt.Doc.ref<DocShared>('dummy-id', initial.bytes, options);
    return {
      schema,
      doc,
    };
  },
};
