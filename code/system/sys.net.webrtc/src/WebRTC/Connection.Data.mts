import { rx, t } from './common';
import { Util } from './util.mjs';

/**
 * Represents a P2P data connection.
 */
export function PeerDataConnection(conn: t.DataConnection): t.PeerDataConnection {
  const { dispose, dispose$ } = rx.disposable();
  const in$ = new rx.Subject<t.PeerDataPayload>();

  let _disposed = false;
  dispose$.subscribe(() => {
    _disposed = true;
    in$.complete();
    conn.close();
  });

  conn.on('close', dispose);
  conn.on('data', (data: any) => {
    if (Util.isType.PeerDataPayload(data)) in$.next(data);
  });

  const api: t.PeerDataConnection = {
    kind: 'data',
    id: conn.connectionId,
    in$: in$.pipe(rx.takeUntil(dispose$)),
    peer: {
      local: (conn.provider as any)._id as string,
      remote: conn.peer,
    },

    get open() {
      return conn.open;
    },

    /**
     * Send an event to the peer.
     */
    send(event: t.Event) {
      const peer = api.peer.local;
      const connection = api.id;
      const payload: t.PeerDataPayload = { source: { peer, connection }, event };
      conn.send(payload);
      return payload;
    },

    dispose,
    dispose$,
    get disposed() {
      return _disposed;
    },
  };

  return api;
}
