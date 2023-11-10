import { DEFAULTS, IndexedDb, NAME, rx, type t } from './common';

const { Record } = IndexedDb;

export const StoreIndexDb = {
  /**
   * Initialie a new entry-point to the DB containing references to Store/Repo indexes.
   */
  init() {
    const name = DEFAULTS.sys.dbname;

    return IndexedDb.init<t.StoreIndexDb>({
      name,
      version: 1,

      /**
       * Database schema declaration.
       */
      schema(req, e) {
        const db = req.result;
        const keyPath: keyof t.RepoDbRecord = 'dbname';
        const stores = db.createObjectStore(NAME.STORE.repos, { keyPath });
        stores.createIndex(NAME.INDEX.repos, [keyPath]);
      },

      /**
       * Database operations.
       */
      store(db) {
        const life = rx.lifecycle();
        const { dispose, dispose$ } = life;
        dispose$.subscribe(() => db.close());

        const api: t.StoreIndexDb = {
          name,
          database: db,

          /**
           * Determine if an DB "index" entry exists for the given store.
           */
          async exists(store) {
            return Boolean(await api.get(store));
          },

          async get(store: t.WebStore) {
            const dbname = Wrangle.dbname(store);
            const tx = db.transaction([NAME.STORE.repos], 'readonly');
            const table = tx.objectStore(NAME.STORE.repos);
            return Record.get<t.RepoDbRecord>(table, dbname);
          },

          /**
           * Add a new store=index reference to the DB.
           */
          async getOrCreate(store: t.WebStore) {
            const dbname = Wrangle.dbname(store);
            if (!dbname) {
              const err = `Cannot add "index" as the store/repo does not have storage enabled.`;
              throw new Error(err);
            }

            const doc = await store.doc.getOrCreate<t.RepoIndex>((d) => (d.docs = []));
            const uri = doc.uri;

            const tx = db.transaction([NAME.STORE.repos], 'readwrite');
            const table = tx.objectStore(NAME.STORE.repos);
            return Record.put<t.RepoDbRecord>(table, { dbname, indexUri: uri });
          },

          async delete(store: t.WebStore) {
            const dbname = Wrangle.dbname(store);
            const existed = await api.exists(store);
            const tx = db.transaction([NAME.STORE.repos], 'readwrite');
            const table = tx.objectStore(NAME.STORE.repos);
            await Record.delete<t.RepoDbRecord>(table, dbname);
            return { existed };
          },

          /**
           * Lifecycle.
           */
          dispose,
          dispose$,
          get disposed() {
            return life.disposed;
          },
        };

        return api;
      },
    });
  },
} as const;

/**
 * Helpers
 */
const Wrangle = {
  dbname(store: t.WebStore) {
    return store.info.storage?.name ?? '';
  },
} as const;
