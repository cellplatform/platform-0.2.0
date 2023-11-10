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
    const doc = await store.doc.findOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      const uri = payload.handle.url;
      const exists = doc.current.docs.some((e) => e.uri === uri);
      if (!exists) doc.change((d) => d.docs.push({ uri }));
    };

    /**
     * Wire up events.
     */
    store.repo.on('document', onDocument);
    store.dispose$.subscribe(() => {
      store.repo.off('document', onDocument);
    });

    // Finish up.
    return { doc } as const;
  },
} as const;
