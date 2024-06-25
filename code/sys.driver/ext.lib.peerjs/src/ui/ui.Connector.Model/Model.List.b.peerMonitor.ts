import { rx, type t } from './common';
import { Data } from './u.Data';
import { State } from './u.State';

/**
 * Monitor events from the peer and sync into the local UI state.
 * NOTE:
 *   This catches changes that may be incoming from remote connected peer.
 *   This is kept as minimal as possible (essentially just the connections)
 *   as more sophisticated syncing is delegated to CRDTs elsewhere.
 */
export async function peerMonitor(args: {
  peer: t.PeerModel;
  list: t.LabelListState;
  array: t.LabelListArray;
  dispose$?: t.UntilObservable;
}) {
  const { peer, list, array } = args;
  const peerEvents = peer.events(args.dispose$);

  const List = {
    get remotes() {
      return array.items
        .map((item, index) => ({ index, item, data: Data.remote(item) }))
        .filter(() => true);
    },
    pluck(remoteid: string) {
      return List.remotes.find((e) => e.data.remoteid === remoteid);
    },
  } as const;

  /**
   * Handler: Connection Ready
   */
  const handleConnectionReady = (conn: t.PeerJsConnData) => {
    const match = List.pluck(conn.peer);
    if (!match) {
      const item = array.last as t.ConnectorItemStateRemote;
      if (item) State.Remote.setAsConnected(item, list, conn);
    }
  };

  /**
   * Event listeners:
   */
  const conn$ = peerEvents.cmd.conn$;
  const data$ = conn$.pipe(rx.filter((e) => e.kind === 'data'));
  const on = (action: t.PeerModelConnAction) => {
    return data$.pipe(
      rx.filter((e) => e.action === action),
      rx.map((e) => peer.get.conn.obj.data(e.connection?.id ?? '')!),
      rx.filter(Boolean),
    );
  };
  on('ready').subscribe((conn) => handleConnectionReady(conn));
}
