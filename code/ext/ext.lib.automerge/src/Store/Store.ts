import { Repo } from '@automerge/automerge-repo';
import { Doc } from './Doc';
import { type t } from './common';

/**
 * Manage an Automerge repo.
 */
export const Store = {
  /**
   * Initialize a new instance of a CRDT repo.
   */
  init(repo?: t.Repo) {
    const api: t.Store = {
      repo: repo ?? new Repo({ network: [] }),
      doc: {
        /**
         * Find or create a new CRDT document from the repo.
         */
        async findOrCreate<T>(initial: t.ImmutableNext<T>, uri?: t.DocUri | string) {
          const res = Doc.findOrCreate<T>(api.repo, { initial, uri });
          await res.handle.whenReady();
          return res;
        },

        /**
         * Create an "initial constructor" factory for typed docs.
         */
        factory<T>(initial: t.ImmutableNext<T>) {
          return (uri?: t.DocUri | string) => api.doc.findOrCreate<T>(initial, uri);
        },

        /**
         * Determine if the given document exists within the repo.
         */
        exists(uri?: t.DocUri | string) {
          return Doc.exists(api.repo, uri);
        },
      },
    } as const;
    return api;
  },
} as const;
