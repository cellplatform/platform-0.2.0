import { Crdt, type t } from './common';
import { Mutate } from './State.Mutate.mjs';

/**
 * Initialize a new state manager.
 */
export function init<N extends string = string>(doc: t.NetworkDocSharedRef) {
  const api: t.WebRtcState<N> = {
    kind: 'WebRtc:State',
    doc,

    /**
     * Current state.
     */
    get current() {
      return doc.current;
    },

    /**
     * Retrieve a new lens within the given namespace
     * on the {network.props} object.
     */
    props<T extends {}>(namespace: N, initial: T) {
      return Crdt.lens<t.NetworkDocShared, T>(doc, (draft) => {
        const network = draft.network;
        const props = network.props || (network.props = {});
        const subject = props[namespace] || (props[namespace] = initial ?? {});
        return subject as T;
      });
    },

    /**
     * Retrieve a new lens for the given peer.
     */
    peer(self, subject, options) {
      return Crdt.lens<t.NetworkDocShared, t.NetworkStatePeer>(doc, (draft) => {
        return Mutate.addPeer(draft.network, self, subject, options).peer;
      });
    },
  };

  return api;
}
