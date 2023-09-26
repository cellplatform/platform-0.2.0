import { Repo } from '@automerge/automerge-repo';
import { Doc } from './Doc';
import { type t } from './common';

export type DocRefArgs<T> = { initial: t.DocChange<T>; uri?: t.AutomergeUrl };

/**
 * Manage an Automerge repo.
 */
export const Store = {
  init(repo?: t.Repo) {
    const api = {
      kind: 'crdt:store',
      repo: repo ?? new Repo({ network: [] }),
      docs: {
        /**
         * Find or create a new CRDT document from the repo.
         */
        async get<T>(initial: t.DocChange<T>, uri?: t.AutomergeUrl) {
          const res = Doc.getOrCreate<T>(api.repo, { initial, uri });
          await res.handle.whenReady();
          return res;
        },

        /**
         * Create an "initial constructor" factory for docs.
         */
        factory<T>(initial: t.DocChange<T>) {
          return (uri?: t.AutomergeUrl) => api.docs.get<T>(initial, uri);
        },
      },
    } as const;
    return api;
  },
} as const;
