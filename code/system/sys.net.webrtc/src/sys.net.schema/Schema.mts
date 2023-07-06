import { type t, Crdt } from './common';
import { bytes, typeDef } from './Schema.bytes.mjs';

import type { NetworkDocShared } from './Schema.bytes.mjs';
export type { NetworkDocShared as DocShared } from './Schema.bytes.mjs';

/**
 * Schema tools for the WebRTC peer network.
 */
export const NetworkSchema = {
  get initial() {
    const doc: NetworkDocShared = {
      network: { peers: {}, props: {} },
      tmp: {},
    };
    return { doc, bytes };
  },

  /**
   * Generate an initial genesis object for the shared CRDT document.
   */
  genesis(options: { dispose$?: t.Observable<any> } = {}) {
    const initial = NetworkSchema.initial;
    const schema = Crdt.Doc.Schema.toByteArray<NetworkDocShared>(initial.doc, { typeDef });
    const doc = Crdt.Doc.ref<NetworkDocShared>('dummy-id', initial.bytes, options);
    return {
      schema,
      doc,
    };
  },
};
