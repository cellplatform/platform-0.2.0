import { Repo } from '@automerge/automerge-repo';
import { Doc } from '../Store.Doc';
import { StoreIndex as Index } from '../Store.Index';
import { Is, rx, type t } from './common';

type Uri = t.DocUri | string;
type Options = { timeout?: t.Msecs };

/**
 * Manage an Automerge repo.
 */
export const Store = {
  Doc,
  Index,
  index: Index.init,

  /**
   * Initialize a new instance of a CRDT repo.
   */
  init(options: { repo?: t.Repo; dispose$?: t.UntilObservable } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;
    const repo = options.repo ?? new Repo({ network: [] });

    const api: t.Store = {
      get repo() {
        return repo;
      },

      doc: {
        /**
         * Create an "initial constructor" factory for typed docs.
         */
        factory<T>(initial: t.ImmutableNext<T>) {
          return (uri?: Uri) => api.doc.getOrCreate<T>(initial, uri);
        },

        /**
         * Find or create a new CRDT document from the repo.
         */
        async getOrCreate<T>(initial: t.ImmutableNext<T>, uri?: Uri, options: Options = {}) {
          const { timeout } = options;
          return Doc.getOrCreate<T>(api.repo, { initial, uri, timeout, dispose$ });
        },

        /**
         * Find the existing CRDT document in the repo (or return nothing).
         */
        async get<T>(uri?: Uri, options: Options = {}) {
          const { timeout } = options;
          return Is.automergeUrl(uri)
            ? Doc.get<T>(api.repo, uri, { timeout, dispose$ })
            : undefined;
        },

        /**
         * Determine if the given document exists within the repo.
         */
        async exists(uri?: Uri, options: Options = {}) {
          const res = await api.doc.get(uri, options);
          return !!res;
        },
      },

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;

    return api;
  },
} as const;
