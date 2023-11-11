import type { DeleteDocumentPayload, DocumentPayload } from '@automerge/automerge-repo';
import { Data, DocUri, type t } from './common';

type Uri = t.DocUri | string;

/**
 * Manages an index of documents within a repository.
 */
export const StoreIndex = {
  /**
   * Create a new Index handle.
   */
  async init(store: t.Store, uri?: string) {
    const repo = store.repo;
    const doc = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    /**
     * Store the URI to new documents in the index.
     */
    const onNewDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      const uri = payload.handle.url;
      const exists = api.exists(uri);
      if (!exists) doc.change((d) => d.docs.push({ uri }));
    };

    const onDeleteDocument = async (payload: DeleteDocumentPayload) => {
      const id = payload.documentId;
      const uri = DocUri.automerge(id);
      const index = api.doc.current.docs.findIndex((item) => item.uri === uri);
      if (index > -1) {
        doc.change((d) => Data.array(d.docs).deleteAt(index));
      }
    };

    /**
     * Repo event listeners.
     */
    repo.on('document', onNewDocument);
    repo.on('delete-document', onDeleteDocument);
    store.dispose$.subscribe(() => {
      repo.off('document', onNewDocument);
      repo.off('delete-document', onDeleteDocument);
    });

    // Finish up.
    const api: t.StoreIndex = {
      kind: 'store:index',
      store,
      doc,
      exists(uri: Uri) {
        return doc.current.docs.some((doc) => doc.uri === uri);
      },
    };

    return api;
  },
} as const;