import { slug, type t } from './common';
import { Wrangle } from './u.Wrangle';

export const Dispatch = {
  common(peer: t.PeerModel) {
    const self = peer.id;
    const dispatch = peer.dispatch;
    return {
      connection(action: t.PeerModelConnAction, conn?: t.PeerJsConn, error?: string) {
        const connection = conn ? Wrangle.dispatchConnection(self, conn) : undefined;
        dispatch({
          type: 'Peer:Connection',
          payload: { tx: slug(), connection, action, error },
        });
      },

      purge() {
        dispatch({
          type: 'Peer:Purge',
          payload: { tx: slug() },
        });
      },

      error(message: string) {
        dispatch({
          type: 'Peer:Error',
          payload: { tx: slug(), message },
        });
      },
    } as const;
  },
};
