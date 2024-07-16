import { Sync } from './Shared.Sync';
import { R, rx, type t } from './common';

/**
 * Setup an event listener for a [Shared] and keep the [Index] in sync with it.
 */
export function listenToShared(
  shared: t.Doc<t.CrdtShared>,
  index: t.StoreIndexState,
  options: { debugLabel?: string; dispose$?: t.UntilObservable } = {},
) {
  const { dispose$, debugLabel } = options;
  const events = shared.events(dispose$);
  events.changed$
    .pipe(
      rx.map((e) => e.after.sys.docs),
      rx.distinctWhile((prev, next) => R.equals(prev, next)),
      rx.debounceTime(100),
    )
    .subscribe((e) => Sync.sharedToIndex(shared, index, { debugLabel }));
}
