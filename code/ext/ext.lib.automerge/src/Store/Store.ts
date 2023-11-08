import { Repo } from '@automerge/automerge-repo';
import { Doc } from './Doc';
import { DocUri as Uri, type t, rx } from './common';

/**
 * Manage an Automerge repo.
 */
export const Store = {
  Uri,

  /**
   * Initialize a new instance of a CRDT repo.
   */
  init(options: { repo?: t.Repo; dispose$?: t.UntilObservable } = {}) {
    const lifecycle = rx.lifecycle(options.dispose$);
    const repo = options.repo ?? new Repo({ network: [] });

    const throwIfDisposed = () => {
      if (lifecycle.disposed) throw new Error('Store is disposed');
    };

    const api: t.Store = {
      get repo() {
        throwIfDisposed();
        return repo;
      },

      doc: {
        /**
         * Find or create a new CRDT document from the repo.
         */
        async findOrCreate<T>(initial: t.ImmutableNext<T>, uri?: t.DocUri | string) {
          throwIfDisposed();
          const res = Doc.findOrCreate<T>(api.repo, { initial, uri });
          await res.handle.whenReady();
          return res;
        },

        /**
         * Create an "initial constructor" factory for typed docs.
         */
        factory<T>(initial: t.ImmutableNext<T>) {
          throwIfDisposed();
          return (uri?: t.DocUri | string) => api.doc.findOrCreate<T>(initial, uri);
        },

        /**
         * Determine if the given document exists within the repo.
         */
        exists(uri?: t.DocUri | string) {
          return Doc.exists(api.repo, uri);
        },
      },

      /**
       * Lifecycle
       */
      dispose: lifecycle.dispose,
      dispose$: lifecycle.dispose$,
      get disposed() {
        return lifecycle.disposed;
      },
    } as const;

    return api;
  },
} as const;
