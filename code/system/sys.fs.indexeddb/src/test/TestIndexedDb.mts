import { IndexedDb } from '../IndexedDb';
import { t, NAME } from '../common';

type T = {
  name: string;
  db: IDBDatabase;
  deleteAll(): Promise<void>;
  getAll(): Promise<{ paths: t.PathRecord[]; files: t.BinaryRecord[] }>;
  getAllPaths(): Promise<t.PathRecord[]>;
  getAllFiles(): Promise<t.BinaryRecord[]>;
};

const { STORE, INDEX } = NAME;
const record = IndexedDb.record;

/**
 * Helpers for evaluating the underlying [IndexedDB] directly.
 */
export const TestIndexedDb = {
  STORE,
  INDEX,
  record,

  init(name: string) {
    return IndexedDb.init<T>({
      name,
      store(db) {
        const api: T = {
          name,
          db,

          async getAll() {
            const paths = api.getAllPaths();
            const files = api.getAllFiles();
            return { paths: await paths, files: await files };
          },

          async getAllPaths() {
            const tx = db.transaction(NAME.STORE.PATHS, 'readonly');
            const store = tx.objectStore(NAME.STORE.PATHS);
            return record.getAll<t.PathRecord>(store);
          },

          async getAllFiles() {
            const tx = db.transaction(NAME.STORE.FILES, 'readonly');
            const store = tx.objectStore(NAME.STORE.FILES);
            return record.getAll<t.BinaryRecord>(store);
          },

          async deleteAll() {
            const { paths, files } = await api.getAll();

            const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
            const store = {
              paths: tx.objectStore(NAME.STORE.PATHS),
              files: tx.objectStore(NAME.STORE.FILES),
            };

            await Promise.all(paths.map(({ path }) => record.delete(store.paths, path)));
            await Promise.all(files.map(({ hash }) => record.delete(store.files, hash)));
          },
        };

        return api;
      },
    });
  },
};
