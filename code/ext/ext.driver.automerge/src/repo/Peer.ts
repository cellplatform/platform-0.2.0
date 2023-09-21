import { slug, type t } from '../common';

type PeerIdKind = 'SharedWorker';

/**
 * Helpers for generating typed peer ID strings.
 */
export const Peer = {
  prefix(kind: PeerIdKind) {
    if (kind === 'SharedWorker') return 'crdt:shared-worker.';
    throw new Error(`ID kind '${kind}' not supported`);
  },

  id(kind: PeerIdKind) {
    return `${Peer.prefix(kind)}${slug()}` as t.PeerId;
  },

  is(kind: PeerIdKind, id: any): id is t.PeerId {
    return typeof id === 'string' ? id.startsWith(Peer.prefix(kind)) : false;
  },
} as const;
