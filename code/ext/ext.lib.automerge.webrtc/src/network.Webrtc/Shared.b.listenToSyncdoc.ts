import { Sync } from './Shared.Sync';
import { R, rx, type t } from './common';

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

  events.$.pipe(
    rx.map((e) => e.payload.doc.shared),
    rx.distinctWhile((prev, next) => R.equals(prev, next)),
    rx.debounceTime(100),
  ).subscribe((e) => Sync.syncdocToIndex(syncdoc, index, { debugLabel }));
}
