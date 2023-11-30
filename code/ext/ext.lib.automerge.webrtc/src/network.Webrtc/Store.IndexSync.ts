import { type t, toObject, Doc } from './common';
import { Patches } from './Store.SyncDoc.patches';

const LocalSync = {
  all(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>) {
    index.doc.current.docs
      .filter((item) => item.shared?.current)
      .filter((item) => !item.meta?.ephemeral)
      .forEach((item) => LocalSync.item(doc, item));
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
    doc.change((d) => {
      if (!isShared || options.action === 'remove') {
        delete d.shared[uri];
      } else {
        const item = Doc.Data.ensure(d.shared, uri, {});
        Doc.Data.assign(item, 'name', name);
      }
    });
  },
} as const;

const RemoteSync = {
  /**
   * Update an iten from the [SyncDoc] into the local [Index]
   */
  item(index: t.StoreIndex, uri: string) {
  },
} as const;

/**
 * Manages syncing an store/index via an networked ephemeral doc.
 */
export const IndexSync = {
  Local: LocalSync,
  Remote: RemoteSync,

  /**
   * Manage keeping a local ephemeral network-doc in sync with an repo/index.
   */
  local(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>, dispose$?: t.UntilObservable) {
    const events = index.events(dispose$);
    events.added$.subscribe((e) => LocalSync.item(doc, e.item));
    events.shared$.subscribe((e) => LocalSync.item(doc, e.item));
    events.renamed$.subscribe((e) => LocalSync.item(doc, e.item));
    events.removed$.subscribe((e) => LocalSync.item(doc, e.item, { action: 'remove' }));
    LocalSync.all(index, doc); // Initial sync.
  },

  /**
   * Manage a remote ephemeral network-doc.
   */
  remote(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>, dispose$?: t.UntilObservable) {
    const events = doc.events(dispose$);

    events.changed$.pipe().subscribe(async (e) => {
      const action = Patches.shared(e);
  },
} as const;
