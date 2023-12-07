import { type t } from './common';

export type Action = 'remove';

export const Sync = {
  /**
   * Sync the entire set of docs within an index.
   */
  all(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>) {
    const items = index.doc.current.docs
      .filter((item) => item.shared?.current)
      .filter((item) => !item.meta?.ephemeral);
    doc.change((d) => items.forEach((item) => Sync.doc(item, d)));
  },

  /**
   * Update an item from the local [Index] into the ephemeral [SyncDoc] clone.
   */
  doc(source: t.RepoIndexDoc, target: t.WebrtcSyncDoc, action?: Action) {
    const uri = source.uri;
    const shared = !!source.shared?.current;
    if (!shared || action === 'remove') {
      delete target.shared[uri];
    } else if (shared) {
      target.shared[uri] = true;
    }
  },
} as const;
