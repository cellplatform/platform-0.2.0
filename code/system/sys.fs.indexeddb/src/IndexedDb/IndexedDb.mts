type DeleteResponse = { name: string; version: number; error?: string };

/**
 * A promise based wrapper into the IndexedDB API.
 *
 *    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 *    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 *    https://gist.github.com/JamesMessinger/a0d6389a5d0e3a24814b
 *
 */
export const IndexedDb = {
  /**
   * Create a promised base interface into an IndexedDb
   */
  create<T>(args: {
    name: string;
    version?: number;
    schema?: (req: IDBOpenDBRequest, e: IDBVersionChangeEvent) => void;
    store: (db: IDBDatabase) => T;
  }) {
    return new Promise<T>((resolve, reject) => {
      const { name, version = 1 } = args;
      const fail = (detail = '') => {
        const msg = `Failed while opening database '${name}' (version ${version}). ${detail}`;
        reject(new Error(msg.trim()));
      };
      try {
        const req = indexedDB.open(name, version);
        req.onupgradeneeded = (e) => args.schema?.(req, e);
        req.onsuccess = () => resolve(args.store(req.result));
        req.onerror = () => fail(req.error?.message);
      } catch (error: any) {
        fail(error.message);
      }
    });
  },

  /**
   * List databases.
   */
  list(): Promise<IDBDatabaseInfo[]> {
    return indexedDB.databases();
  },

  /**
   * Delete the named database.
   */
  async delete(name: string) {
    return new Promise<DeleteResponse>(async (resolve, reject) => {
      const list = await IndexedDb.list();
      const db = list.find((item) => item.name === name);

      const done = (error?: string) => {
        const name = db?.name ?? '';
        const version = db?.version ?? -1;
        resolve({ name, version, error });
      };

      const fail = (detail = '') => {
        const error = `Failed while opening database '${name}'. ${detail}`.trim();
        return done(error);
      };

      if (!db) return fail('Database does not exist');

      try {
        const req = indexedDB.deleteDatabase(name);
        req.onerror = () => fail();
        req.onsuccess = (e) => done();
      } catch (error: any) {
        done(`Failed while deleting database '${name}'. ${error.message}`.trim());
      }
    });
  },

  /**
   * Convert a [IDBRequest] to a <Typed> promise.
   */
  async asPromise<T>(req: IDBRequest<any>) {
    return new Promise<T>((resolve, reject) => {
      req.onerror = () => reject(req.error || 'DBRequest failed');
      req.onsuccess = () => resolve(req.result);
    });
  },

  /**
   * Operations on DB record objects.
   */
  record: {
    /**
     * Retrieves the value of the first record matching the
     * given key or key range in query.
     */
    async get<T>(store: IDBObjectStore | IDBIndex, query: IDBValidKey | IDBKeyRange) {
      return IndexedDb.asPromise<T | undefined>(store.get(query));
    },
    async getAll<T>(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange) {
      return IndexedDb.asPromise<T[]>(store.getAll(query));
    },

    /**
     * Add or update an object in the given store.
     */
    async put<T>(store: IDBObjectStore, value: T, key?: IDBValidKey) {
      return IndexedDb.asPromise<T>(store.put(value, key));
    },

    /**
     * Delete an object.
     */
    async delete<T>(store: IDBObjectStore, key: IDBValidKey | IDBKeyRange) {
      return IndexedDb.asPromise<T>(store.delete(key));
    },
  },
};
