import { t, rx } from './common';
import { Util } from './util.mjs';

/**
 * Manage a P2P data connection.
 */
export function PeerDataConnection(conn: t.DataConnection): t.PeerDataConnection {
  const { dispose, dispose$ } = rx.disposable();

  let _disposed = false;
  dispose$.subscribe(() => {
    _disposed = true;
    conn.close();
    in$.complete();
    out$.complete();
  });

  conn.on('close', () => dispose());

  conn.on('data', (data: any) => {
    if (Util.is.dataPayload(data)) in$.next(data);
  });

  const in$ = new rx.Subject<t.PeerDataPayload>();
  const out$ = new rx.Subject<t.PeerDataPayload>();
  out$.pipe(rx.filter(() => !api.disposed)).subscribe((e) => conn.send(e));

  const api: t.PeerDataConnection = {
    kind: 'data',
    dispose,
    dispose$,
    id: conn.connectionId,
    in$: in$.pipe(rx.takeUntil(dispose$)),
    out$: out$.pipe(rx.takeUntil(dispose$)),

    peer: {
      local: (conn.provider as any)._id as string,
      remote: conn.peer,
    },

    get open() {
      return conn.open;
    },

    get disposed() {
      return _disposed;
    },

    /**
     * Send an event to the peer.
     */
    send(event: t.Event) {
      const peer = api.peer.local;
      const connection = api.id;
      out$.next({ source: { peer, connection }, event });
    },
  };

  return api;
}
