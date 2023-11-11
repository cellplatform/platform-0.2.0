import { type DocumentPayload } from '@automerge/automerge-repo';
import { type t } from './common';

/**
 * Manages an index of documents within a repository.
 */
export const StoreIndex = {
  /**
   * Create a new Index handle.
   */
  async init(store: t.Store, uri?: string) {
    const index = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      const uri = payload.handle.url;
      const exists = index.current.docs.some((e) => e.uri === uri);
      if (!exists) index.change((d) => d.docs.push({ uri }));
    };

    /**
     * Wire up events.
     */
    store.repo.on('document', onDocument);
    store.dispose$.subscribe(() => store.repo.off('document', onDocument));

    // Finish up.
    const api: t.StoreIndex = {
      kind: 'store:index',
      store,
      index,
    };
    return api;
  },
} as const;
