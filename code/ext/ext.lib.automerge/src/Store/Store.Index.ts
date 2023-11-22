import type { DeleteDocumentPayload, DocumentPayload } from '@automerge/automerge-repo';
import { Data, DocUri, Is, type t } from './common';
import { events } from './Store.Index.Events';

type Uri = t.DocUri | string;

/**
 * Manages an index of documents within a repository.
 */
export const StoreIndex = {
  events,

  /**
   * Create a new Index handle.
   */
  async init(store: t.Store, uri?: string) {
    const repo = store.repo;
    const doc = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    if (!Is.repoIndex(doc.current)) {
      const name = Wrangle.storeName(store);
      const err = `Failed while retrieveing Index document on store/repo "${name}". Document with URI "${uri}" was malformed.`;
      throw new Error(err);
    }

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      api.add(payload.handle.url);
    };

    const onDeleteDocument = async (payload: DeleteDocumentPayload) => {
      const uri = DocUri.automerge(payload.documentId);
      api.remove(uri);
    };

    /**
     * Repo event listeners.
     */
    repo.on('document', onDocument);
    repo.on('delete-document', onDeleteDocument);
    store.dispose$.subscribe(() => {
      repo.off('document', onDocument);
      repo.off('delete-document', onDeleteDocument);
    });

    // Finish up.
    const api: t.StoreIndex = {
      kind: 'store:index',
      store,
      doc,
      get total() {
        return doc.current.docs.length;
      },
      exists(uri: Uri) {
        return doc.current.docs.some((doc) => doc.uri === uri);
      },
      add(uri: Uri) {
        const exists = api.exists(uri);
        if (!exists) doc.change((d) => d.docs.push({ uri }));
        return !exists;
      },
      remove(uri: Uri) {
        const index = api.doc.current.docs.findIndex((item) => item.uri === uri);
        const exists = index > -1;
        if (exists) doc.change((d) => Data.array(d.docs).deleteAt(index));
        return exists;
      },
      events(dispose$) {
        return events(api, { dispose$: [dispose$, store.dispose$] });
      },
    };

    return api;
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  storeName(store: t.Store) {
    const name = Is.webStore(store) ? store.info.storage?.name : '';
    return name || 'Unknown';
  },
} as const;
