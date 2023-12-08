import { Patches } from './SyncDoc.Patches';
import { Doc, Store, rx, type t } from './common';

/**
 * Setup an event listener for a [SyncDoc] and keep the [Index] in sync with it.
 */
export function listenToDoc(args: {
  index: t.StoreIndex;
  doc: t.DocRefHandle<t.WebrtcSyncDoc>;
  debugLabel?: string;
  dispose$?: t.UntilObservable;
}) {
  const { index, doc, dispose$, debugLabel } = args;
  const events = doc.events(dispose$);
  const Mutate = Store.Index.Mutate;

  const action$ = events.changed$.pipe(
    rx.map((e) => ({ doc: e.doc, action: Patches.shared(e) })),
    rx.filter((e) => !!(e.action.del || e.action.put)),
  );
  const put$ = action$.pipe(
    rx.filter((e) => !!e.action.put?.value),
    rx.map(({ action, doc }) => ({ doc, uri: action.put?.uri! })),
  );
  const del$ = action$.pipe(
    rx.filter((e) => !!e.action.del),
    rx.map(({ action, doc }) => ({ doc, uri: action.del?.uri! })),
  );

  /**
   * Listeners.
   */
  put$.subscribe(async (e) => {
    if (!index.exists(e.uri)) await index.add(e.uri);
    index.doc.change((d) => {
      const docs = Doc.Data.array(d.docs);
      const i = docs.findIndex(({ uri }) => uri === e.uri);
      const current = docs[i].shared?.current;
      if (current !== true) Mutate.toggleShared(d, i, { value: true });
    });
  });

  del$.subscribe((e) => {
    if (!index.exists(e.uri)) return;
    index.doc.change((d) => {
      const docs = Doc.Data.array(d.docs);
      const i = docs.findIndex(({ uri }) => uri === e.uri);
      const current = docs[i].shared?.current;
      if (current !== false) Mutate.toggleShared(d, i, { value: false });
    });
  });
}
