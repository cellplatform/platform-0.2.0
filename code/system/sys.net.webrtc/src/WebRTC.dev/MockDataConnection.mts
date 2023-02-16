import { rx, slug, t, Util } from './common';

type EdgeOptions = {
  id: string;
  metadata: t.PeerMetaData;
  peer: t.PeerDataConnection['peer'];
};

type Edge = {
  dispose(): void;
  conn: t.PeerDataConnection;
  connect(remote: Edge): void;
};

const createPeerId = () => `mock_peer.${slug()}`;
const createConnId = () => `dc_mock.${slug()}`;

/**
 * An in-memory mock implementation of a
 * data-connection between two peers.
 */
export const MockDataConnection = {
  /**
   * Create a two-sided connection between two peers.
   */
  connect() {
    const id = createConnId();
    const peerA = createPeerId();
    const peerB = createPeerId();

    const a = MockDataConnection.edge({ id, peer: { local: peerA, remote: peerB } });
    const b = MockDataConnection.edge({ id, peer: { local: peerB, remote: peerA } });

    a.connect(b);
    b.connect(a);

    return { a: a.conn, b: b.conn };
  },

  /**
   * Create a new edge ("local" or "remote") of a data-connection.
   */
  edge(options: Partial<EdgeOptions> = {}): Edge {
    const { dispose, dispose$ } = rx.disposable();
    const in$ = new rx.Subject<t.PeerDataPayload>();
    const out$ = new rx.Subject<t.PeerDataPayload>();

    const id = options.id || createConnId();
    const metadata: t.PeerMetaData = options.metadata ?? { name: 'Unnamed' };
    const peer = options.peer ?? {
      local: createPeerId(),
      remote: createPeerId(),
    };

    let _disposed = false;
    dispose$.subscribe(() => {
      _disposed = true;
      in$.complete();
      out$.complete();
    });

    const conn: t.PeerDataConnection = {
      id,
      kind: 'data',
      metadata,
      peer,

      get isOpen() {
        return conn.isDisposed ? false : true;
      },

      in$: in$.pipe(rx.takeUntil(dispose$)),
      out$: out$.pipe(rx.takeUntil(dispose$)),

      send<E>(event: E) {
        const payload = Util.toDataPayload(conn, event as t.Event);
        if (!_disposed) out$.next(payload);
        return payload;
      },

      dispose,
      dispose$,
      get isDisposed() {
        return _disposed;
      },
    };

    return {
      dispose,
      conn,
      connect(remote: Edge) {
        const remote$ = remote.conn.out$.pipe(rx.takeUntil(dispose$), rx.delay(0));
        remote$.subscribe((e) => in$.next(e));
      },
    };
  },
};
