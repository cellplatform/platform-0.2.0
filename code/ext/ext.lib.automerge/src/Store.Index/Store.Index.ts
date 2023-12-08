import type { DeleteDocumentPayload, DocumentPayload } from '@automerge/automerge-repo';
import { Doc } from '../Store.Doc';
import { events } from './Store.Index.Events';
import { Mutate } from './Store.Index.Mutate';
import { Data, Delete, DocUri, Is, R, type t } from './common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;
type Uri = t.DocUri | string;

/**
 * Manages an index of documents within a repository.
 */
export const StoreIndex = {
  Mutate,
  events,
  filter: Wrangle.filter,

  /**
   * Create a new Index handle.
   */
  async init(store: t.Store, options: { uri?: string } = {}) {
    const { uri } = options;
    const repo = store.repo;
    const doc = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []), uri);

    if (!Is.repoIndex(doc.current)) {
      const name = wrangle.storeName(store);
      const err = `Failed while retrieving Index document on store/repo "${name}". Document with URI "${uri}" was malformed.`;
      throw new Error(err);
    }

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (payload: DocumentPayload) => {
      if (!payload.isNew) return;
      const uri = payload.handle.url;
      await api.add({ uri });
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
       * If an array of URIs is passed, exists means "all URIs exist".
       */
      exists(input) {
        const uris = (Array.isArray(input) ? input : [input]).filter(Boolean);
        if (uris.length === 0) return false;
        return uris.every((uri) => doc.current.docs.some((doc) => doc.uri === uri));
      },

      /**
       * Add a new entry to the index.
       */
      async add(input) {
        const inputs = (Array.isArray(input) ? input : [input]).filter(Boolean);
        const wait = inputs.map(async (e) => ({ ...e, meta: await wrangle.meta(store, e.uri) }));
        const items = await Promise.all(wait);
        if (api.exists(inputs.map((e) => e.uri))) return 0;

        let added = 0;
        api.doc.change((d) => {
          const inserts = items
            .filter((e) => !d.docs.some(({ uri }) => e.uri === uri))
            .map(({ uri, name, meta }) => Delete.undefined({ uri, name, meta }));

          const unique = R.uniqBy((e) => e.uri, inserts);
          unique.forEach((e) => d.docs.push(e));
          added = unique.length;
        });

        return added;
      },

      /**
       * Remove the given document from the index.
       */
      remove(input) {
        const findIndex = (uri: string) => api.doc.current.docs.findIndex((e) => e.uri === uri);
        let uris = (Array.isArray(input) ? input : [input]).filter(Boolean);
        uris = uris.filter((uri) => findIndex(uri) > -1);
        uris = R.uniq(uris);

        const total = uris.length;
        if (total > 0) {
          doc.change((d) => {
            const docs = Data.array(d.docs);
            uris.forEach((uri) => docs.deleteAt(findIndex(uri)));
          });
        }

        return total;
      },
    };

    return api;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
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

  shared(item: t.RepoIndexDoc) {
    if (typeof item.shared !== 'object') item.shared = { current: false };
    return item.shared!;
  },
} as const;
