import { Doc, type t } from './common';

export function local(
  index: t.StoreIndex,
  doc: t.DocRefHandle<t.WebrtcSyncDoc>,
  dispose$?: t.UntilObservable,
) {
  const events = index.events(dispose$);
  events.added$.subscribe((e) => Local.item(doc, e.item));
  events.shared$.subscribe((e) => Local.item(doc, e.item));
  events.renamed$.subscribe((e) => Local.item(doc, e.item));
  events.removed$.subscribe((e) => Local.item(doc, e.item, { action: 'remove' }));
  Local.all(index, doc); // Initial sync.
}

export const Local = {
  /**
   * Manage keeping a local ephemeral network-doc in sync with an repo/index.
   */
  init(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>, dispose$?: t.UntilObservable) {
    const events = index.events(dispose$);
    events.added$.subscribe((e) => Local.item(doc, e.item));
    events.shared$.subscribe((e) => Local.item(doc, e.item));
    events.renamed$.subscribe((e) => Local.item(doc, e.item));
    events.removed$.subscribe((e) => Local.item(doc, e.item, { action: 'remove' }));
    Local.all(index, doc); // Initial sync.
  },

  /**
   * Sync the entire set of docs within an index.
   */
  all(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>) {
    index.doc.current.docs
      .filter((item) => item.shared?.current)
      .filter((item) => !item.meta?.ephemeral)
      .forEach((item) => Local.item(doc, item));
  },

  /**
   * Update an item from the local [Index] into the shared [SyncDoc] clone.
   */
  item(
    doc: t.DocRefHandle<t.WebrtcSyncDoc>,
    item: t.RepoIndexDoc,
    options: { action?: 'remove' } = {},
  ) {
    const { uri, name } = item;
    const isShared = !!item.shared?.current;
    const remove = !isShared || options.action === 'remove';
    doc.change((d) => {
      if (remove) {
        delete d.shared[uri];
      } else {
        const item = Doc.Data.ensure(d.shared, uri, {});
        Doc.Data.assign(item, 'name', name);
      }
    });
  },
} as const;
