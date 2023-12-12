import { Sync } from './Shared.Sync';
import { type t } from './common';

/**
 * Setup event listener for an [Index] and keep the [SyncDoc] in sync.
 */
export function listenToIndex(
  index: t.StoreIndex,
  syncdoc: t.DocRefHandle<t.WebrtcSyncDoc>,
  options: { debugLabel?: string; dispose$?: t.UntilObservable } = {},
) {
  const { debugLabel, dispose$ } = options;
  const events = index.events(dispose$);
  const change = (indexItem: t.StoreIndexDocItem, action?: t.WebrtcSyncDocMutateAction) => {
    syncdoc.change((d) => Sync.Mutate.syncdoc(d, indexItem, { action, debugLabel }));
  };
  events.added$.subscribe((e) => change(e.item));
  events.shared$.subscribe((e) => change(e.item));
  events.renamed$.subscribe((e) => change(e.item));
  events.removed$.subscribe((e) => change(e.item, 'unshare'));
}
