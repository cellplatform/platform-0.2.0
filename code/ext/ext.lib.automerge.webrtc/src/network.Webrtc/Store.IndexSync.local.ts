import { Doc, type t } from './common';

type D = t.DocRefHandle<t.WebrtcSyncDoc>;
type Action = 'remove';

export const Local = {
  /**
   * Manage keeping a local ephemeral network-doc in sync with an repo/index.
   */
  init(
    index: t.StoreIndex,
    doc: { local: D },
    options: { dispose$?: t.UntilObservable; label?: string } = {},
  ) {
    const { label, dispose$ } = options;
    const events = {
      index: index.events(dispose$),
      doc: doc.local.events(dispose$),
    } as const;

    const change = (doc: D, source: t.RepoIndexDoc, action?: Action) => {
      doc.change((d) => Local.sync(source, d, action));
    };

    events.index.added$.subscribe((e) => change(doc.local, e.item));
    events.index.shared$.subscribe((e) => change(doc.local, e.item));
    events.index.renamed$.subscribe((e) => change(doc.local, e.item));
    events.index.removed$.subscribe((e) => change(doc.local, e.item, 'remove'));
    Local.all(index, doc.local); // Initial sync.
  },

  /**
   * Sync the entire set of docs within an index.
   */
  all(index: t.StoreIndex, doc: D) {
    index.doc.current.docs
      .filter((item) => item.shared?.current)
      .filter((item) => !item.meta?.ephemeral)
      .forEach((item) => doc.change((d) => Local.sync(item, d)));
  },

  /**
   * Update an item from the local [Index] into the ephemeral [SyncDoc] clone.
   */
  sync(source: t.RepoIndexDoc, target: t.WebrtcSyncDoc, action?: Action) {
    const shared = !!source.shared?.current;
    const findIndex = () => target.shared.findIndex((uri) => uri === source.uri);
    if (!shared || action === 'remove') {
      const index = findIndex();
      if (index > -1) Doc.Data.array(target.shared).deleteAt(index);
    } else if (shared && findIndex() < 0) {
      target.shared.push(source.uri);
    }
  },
} as const;
