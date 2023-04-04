import { t } from './common';

/**
 * Helpers for working with the {peers} object within a CRDT document.
 */
export function DocPeers<P extends {}>(args?: t.MonacoCrdtSyncerDocPeersArg<P>) {
  const api = {
    get $() {
      return args?.doc.$;
    },

    get(doc: P) {
      return args?.getPeers(doc);
    },

    change(fn: (peers: t.EditorPeersState) => void) {
      if (!args) throw new Error(`Ensure a {peers} argument is provided`);
      args.doc.change((d) => {
        const peers = api.get(d);
        if (typeof peers !== 'object') {
          throw new Error(`[EditorPeersState] not returned from getter`);
        }
        fn(peers);
      });
    },

    changeLocal(fn: (local: t.EditorPeerState) => void) {
      if (!args) throw new Error(`Ensure a {peers} argument is provided`);
      api.change((obj) => {
        if (!obj[args.local]) obj[args.local] = {};
        fn(obj[args.local]);
      });
    },
  };

  return api;
}
