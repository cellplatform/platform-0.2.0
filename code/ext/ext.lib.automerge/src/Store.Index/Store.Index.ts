import type { DeleteDocumentPayload, DocumentPayload } from '@automerge/automerge-repo';
import { Doc } from '../Store.Doc';
import { events } from './Store.Index.Events';
import { Patches } from './Store.Index.Patches';
import { Data, Delete, DocUri, Is, type t } from './common';

type O = Record<string, unknown>;
type Uri = t.DocUri | string;

/**
 * Manages an index of documents within a repository.
 */
export const StoreIndex = {
  Patches,
  events,

  /**
   * Filter a set of docs within the index.
   */
  filter(docs: t.RepoIndexDoc[], filter?: t.RepoIndexFilter) {
    return !filter ? docs : docs.filter((doc, index) => filter({ doc, index }, index));
  },

  /**
   * Create a new Index handle.
   */
  async init(store: t.Store, options: { uri?: string } = {}) {
    const { uri } = options;
    const repo = store.repo;
    const doc = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    if (!Is.repoIndex(doc.current)) {
      const name = Wrangle.storeName(store);
      const err = `Failed while retrieving Index document on store/repo "${name}". Document with URI "${uri}" was malformed.`;
      throw new Error(err);
    }

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      await api.add(payload.handle.url);
    };

    const onDeleteDocument = async (payload: DeleteDocumentPayload) => {
      const uri = DocUri.automerge(payload.documentId);
      await api.remove(uri);
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

      /**
       * Construct a new event manager for the index.
       */
      events(dispose$) {
        return events(api, { dispose$: [dispose$, store.dispose$] });
      },

      /**
       * Count the total number of items within the index.
       */
      total(filter) {
        return StoreIndex.filter(doc.current.docs, filter).length;
      },

      /**
       * Determine if a document with the given URI exists in the index.
       */
      exists(uri: Uri) {
        return doc.current.docs.some((doc) => doc.uri === uri);
      },

      /**
       * Add a new entry to the index.
       */
      async add(uri: Uri) {
        const exists = api.exists(uri);
        if (exists) return false;
        const meta = await Wrangle.meta(store, uri);
        api.doc.change((d) => d.docs.push(Delete.undefined({ uri, meta })));
        return true;
      },

      /**
       * Remove the given document from the index.
       */
      async remove(uri: Uri) {
        const index = api.doc.current.docs.findIndex((item) => item.uri === uri);
        const exists = index > -1;
        if (exists) doc.change((d) => Data.array(d.docs).deleteAt(index));
        return exists;
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

  /**
   * Extract salient meta-data from the document to store
   * on the document-index item.
   *
   * NOTE: not all meta-data is bulk copied over to ensure that
   *       we don't have to maintain all future meta-data by default
   *       (replication) AND that we don't inadvertently copy possible
   *       future sensitive data off into an index (security).
   */
  async meta(store: t.Store, uri: Uri) {
    const ref = await store.doc.get<O>(uri);
    if (!ref?.current) return undefined;

    const meta = Doc.Meta.get(ref.current);
    if (!meta) return undefined;

    const res: t.RepoIndexDocMeta = {};
    res.ephemeral = meta.ephemeral;
    return Delete.undefined(res);
  },
} as const;
