import { slug, type t } from './common';

/**
 * Helpers for generating typed peer ID strings.
 */
export const Peer = {
  id: {
    prefix(kind: t.PeerIdKind) {
      if (kind === 'SharedWorker') return 'shared-worker';
      if (kind === 'StorageServer') return 'storage-server';
      throw new Error(`ID kind '${kind}' not supported`);
    },

    generate(kind: t.PeerIdKind, suffix?: string) {
      let id = Peer.id.prefix(kind);
      if (typeof suffix === 'string' && suffix) id = `${id}-${suffix}`;
      if (suffix === undefined) id = `${id}-${slug()}`;
      return id as t.PeerId;
    },

    is(kind: t.PeerIdKind, id: any): id is t.PeerId {
      if (typeof id !== 'string') return false;
      return id.startsWith(Peer.id.prefix(kind));
    },
  },
} as const;
