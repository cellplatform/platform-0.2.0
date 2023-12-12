import { Patches } from './SyncDoc.Patches';
import { rx, type t } from './common';

/**
 * Setup an event listener for a [SyncDoc] and keep the [Index] in sync with it.
 */
export function listenToSyncdoc(
  syncdoc: t.DocRefHandle<t.WebrtcSyncDoc>,
  index: t.StoreIndex,
  options: { debugLabel?: string; dispose$?: t.UntilObservable } = {},
) {
  const { dispose$, debugLabel } = options;
  const events = syncdoc.events(dispose$);

  const shared$ = events.changed$.pipe(
    rx.map((e) => ({ doc: e.doc, put: Patches.shared(e)! })),
    rx.filter((e) => !!e.put),
  );

  /**
   * Listeners.
   */
  shared$.subscribe(async (e) => {
    const { uri, shared, version } = e.put;
    const exists = index.exists(uri);
    if (!exists) {
      await index.add({ uri, shared });
    } else {
      index.toggleShared(uri, { shared, version });
    }
  });
}
