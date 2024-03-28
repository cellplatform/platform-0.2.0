import { rx, type t, WebRtcUtils } from './common';

/**
 * Represents a P2P data connection.
 */
export function PeerDataConnection(conn: t.DataConnection): t.PeerDataConnection {
  const { dispose, dispose$ } = rx.disposable();
  const in$ = new rx.Subject<t.PeerDataPayload>();
  const out$ = new rx.Subject<t.PeerDataPayload>();
  const metadata: t.PeerMetaData = conn.metadata || { label: 'Unnamed' };

  let _disposed = false;
  dispose$.subscribe(() => {
    _disposed = true;
    in$.complete();
    out$.complete();
    conn.close();
  });

  out$.subscribe((payload) => conn.send(payload));
  conn.on('close', dispose);
  conn.on('data', (data: any) => {
    if (WebRtcUtils.isType.PeerDataPayload(data)) in$.next(data);
  });

  const api: t.PeerDataConnection = {
    id: conn.connectionId,
    kind: 'data',
    metadata,
    peer: {
      local: (conn.provider as any)._id as string,
      remote: conn.peer,
    },

    get isOpen() {
      return api.isDisposed ? false : conn.open;
    },

    in$: in$.pipe(rx.takeUntil(dispose$)),
    out$: out$.pipe(rx.takeUntil(dispose$)),

    /**
     * Send an event to the peer.
     */
    send<E extends t.Event>(event: E) {
      const payload = WebRtcUtils.toDataPayload(api, event);
      out$.next(payload);
      return payload;
    },

    /**
     * Convert the in$ stream and send method into a standard event-bus.
     */
    bus<E extends t.Event>() {
      const $ = in$.pipe(rx.map((e) => e.event as E));
      const fire = api.send;
      return { $, fire } as t.EventBus<E>;
    },

    /**
     * [Dispose]
     */
    dispose,
    dispose$,
    get isDisposed() {
      return _disposed;
    },
  };

  return api;
}
