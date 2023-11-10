import { Repo } from '@automerge/automerge-repo';
import { Doc } from './Doc';
import { StoreIndex as Index } from './Store.Index';
import { DocUri as Uri, rx, type t, Time, DEFAULTS, Is } from './common';

type Uri = t.DocUri | string;
type Options = { timeout?: t.Msecs };

/**
 * Manage an Automerge repo.
 */
export const Store = {
  Uri,
  Index,

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
          return (uri?: Uri) => api.doc.findOrCreate<T>(initial, uri);
        },

        /**
         * Find or create a new CRDT document from the repo.
         */
        async findOrCreate<T>(initial: t.ImmutableNext<T>, uri?: Uri) {
          const res = Doc.findOrCreate<T>(api.repo, { initial, uri, dispose$ });
          await res.handle.whenReady();
          return res;
        },

        /**
         * Find the existing CRDT document in the repo (or return nothing).
         */
        async find<T>(uri?: Uri, options: Options = {}) {
          if (!Is.automergeUrl(uri)) return undefined;

          type R = t.DocRefHandle<T> | undefined;
          return new Promise<R>((resolve) => {
            const { timeout = DEFAULTS.timeout.find } = options;
            const ref = Doc.find<T>(api.repo, uri, dispose$);
            if (!ref) return resolve(undefined);

            const done$ = rx.subject();
            const done = (res: R) => {
              rx.done(done$);
              resolve(res);
            };

            Time.until(done$).delay(timeout, () => done(undefined));
            ref.handle.whenReady().then(() => done(ref));
          });
        },

        /**
         * Determine if the given document exists within the repo.
         */
        async exists(uri?: Uri, options: Options = {}) {
          const res = await api.doc.find(uri, options);
          return Boolean(res);
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
