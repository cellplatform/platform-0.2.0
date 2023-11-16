import { rx, type t } from './common';
import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStore = {
  init(store: t.Store, peer: t.PeerModel) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;

    const added$ = rx.subject<t.WebrtcStoreNetworkAdapterAdded>();
    let _totalAdded = 0;

    const events = peer.events();
    const dataReady$ = events.cmd.conn$.pipe(
      rx.filter((e) => e.kind === 'data'),
      rx.filter((e) => e.action === 'ready'),
      rx.map((e) => e.connection?.id ?? ''),
      rx.filter(Boolean),
    );

    dataReady$.subscribe((id) => {
      const obj = peer.get.conn.obj.data(id);
      if (!obj) throw new Error(`Failed to retrieve data connection with id "${id}".`);

      const adapter = new WebrtcNetworkAdapter(obj!);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);

      _totalAdded += 1;
      added$.next({ conn: { id, obj }, adapter });
    });

    const api: t.WebrtcStore = {
      store,
      peer,
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
