import { Repo } from '@automerge/automerge-repo';
import { Doc } from './Doc';
import { type t } from './common';

/**
 * Manage an Automerge repo.
 */
export const Store = {
  init(repo?: t.Repo) {
    const api = {
      kind: 'crdt:store',
      repo: repo ?? new Repo({ network: [] }),
      doc: {
        /**
         * Find or create a new CRDT document from the repo.
         */
        async findOrCreate<T>(initial: t.DocChange<T>, uri?: t.AutomergeUrl) {
          const res = Doc.findOrCreate<T>(api.repo, { initial, uri });
          await res.handle.whenReady();
          return res;
        },

        /**
         * Create an "initial constructor" factory for typed docs.
         */
        factory<T>(initial: t.DocChange<T>) {
          return (uri?: t.AutomergeUrl) => api.doc.findOrCreate<T>(initial, uri);
        },

        /**
         * Determine if the given document exists within the repo.
         */
        exists(uri?: string) {
          return Doc.exists(api.repo, uri);
        },
      },
    } as const;
    return api;
  },
} as const;
