import { Sync, type Action } from './SyncDoc.Sync';
import { type t } from './common';

/**
 * Setup event listener for an [Index] and keep the [SyncDoc] in sync.
 */
export function listenToIndex(args: {
  index: t.StoreIndex;
  doc: t.DocRefHandle<t.WebrtcSyncDoc>;
  debugLabel?: string;
  dispose$?: t.UntilObservable;
}) {
  const { index, doc, dispose$ } = args;
  const events = index.events(dispose$);
  const change = (source: t.RepoIndexDoc, action?: Action) => {
    doc.change((d) => Sync.doc(source, d, action));
  };
  events.added$.subscribe((e) => change(e.item));
  events.shared$.subscribe((e) => change(e.item));
  events.renamed$.subscribe((e) => change(e.item));
  events.removed$.subscribe((e) => change(e.item, 'remove'));
}
