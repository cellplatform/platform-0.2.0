import { type t, rx } from './common';
import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStoreManager = {
  init(store: t.Store, peer: t.PeerModel) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;
    const added$ = rx.subject<string>();
    let _totalAdded = 0;

    const events = peer.events();
    const dataReady$ = events.cmd.conn$.pipe(
      rx.filter((e) => e.kind === 'data'),
      rx.filter((e) => e.action === 'ready'),
      rx.map((e) => e.connection?.id ?? ''),
      rx.filter(Boolean),
    );

    dataReady$.subscribe((id) => {
      const conn = peer.get.conn.obj.data(id);
      const adapter = new WebrtcNetworkAdapter(conn!);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);
      _totalAdded += 1;
      added$.next(id);
    });

    const api: t.WebrtcStoreManager = {
      added$: added$.pipe(rx.takeUntil(dispose$)),
      total: {
        get added() {
          return _totalAdded;
        },
      },

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;

    return api;
  },
} as const;
