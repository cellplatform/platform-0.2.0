import type { DeleteDocumentPayload, DocumentPayload } from '@automerge/automerge-repo';
import { Doc } from '../Store.Doc';
import { events } from './Store.Index.Events';
import { Mutate } from './Store.Index.Mutate';
import { Data, Delete, DocUri, Is, R, type t } from './common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;
type Uri = string;
type UriInput = Uri | Uri[];

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
    const doc = await store.doc.getOrCreate<t.StoreIndex>((d) => (d.docs = []), uri);
    const findIndex = (uri: string) => api.doc.current.docs.findIndex((e) => e.uri === uri);

    if (!Is.repoIndex(doc.current)) {
      const name = wrangle.storeName(store);
      const err = `Failed while retrieving Index document on store/repo "${name}". Document with URI "${uri}" was malformed.`;
      throw new Error(err);
    }

    /**
     * Store the URI to new documents in the index.
     */
    const onDocument = async (e: DocumentPayload) => {
      if (!e.isNew) return;
      const uri = e.handle.url;
      await api.add({ uri });
    };

    const onDeleteDocument = async (e: DeleteDocumentPayload) => {
      const uri = DocUri.automerge(e.documentId);
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
    const api: t.StoreIndexState = {
      kind: 'store.index:state',
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

        const toggleShared: { uri: string; value: boolean }[] = [];
        let added = 0;

        api.doc.change((d) => {
          const inserts = items
            .filter((e) => !d.docs.some(({ uri }) => e.uri === uri))
            .map(({ shared, uri, name, meta }) => ({
              uri,
              shared,
              doc: Delete.undefined<t.StoreIndexDoc>({ uri, name, meta }),
            }));

          const unique = R.uniqBy((e) => e.uri, inserts);
          unique.forEach((e) => {
            d.docs.push(e.doc);
            if (typeof e.shared === 'boolean') toggleShared.push({ uri: e.uri, value: e.shared });
          });
          added = unique.length;
        });

        toggleShared.forEach(({ uri, value }) => api.toggleShared(uri, { shared: value }));
        return added;
      },

      /**
       * Remove the given document from the index.
       */
      remove(input) {
        let uris = wrangle.uris(input);
        uris = R.uniq(uris);
        uris = uris.filter((uri) => findIndex(uri) > -1);
        if (uris.length > 0) {
          doc.change((d) => {
            const docs = Data.array(d.docs);
            uris.forEach((uri) => docs.deleteAt(findIndex(uri)));
          });
        }
        return uris.length;
      },

      /**
       * Toggles the shared state of the given URI(s).
       */
      toggleShared(input, options = {}) {
        type T = ReturnType<t.StoreIndexState['toggleShared']>[number];
        const res: T[] = [];

        let uris = wrangle.uris(input);
        uris = R.uniq(uris);
        uris = uris.filter((uri) => findIndex(uri) > -1);

        if (uris.length > 0) {
          doc.change((d) => {
            const docs = Data.array(d.docs);
            uris.forEach((uri) => {
              const i = findIndex(uri);
              const doc = docs[i];
              const shared = Mutate.toggleShared(doc, options);
              res.push({ uri, shared: shared.current, version: shared.version.value });
            });
          });
        }

        return res;
      },
    };

    return api;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  uris(input: UriInput) {
    input = !input ? [] : input;
    return (Array.isArray(input) ? input : [input]).filter(Boolean);
  },

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

    const res: t.StoreIndexDocMeta = {};
    res.ephemeral = meta.ephemeral;
    return Delete.undefined(res);
  },
} as const;
