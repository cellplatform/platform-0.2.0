import { IndexedDb, NAME, Path, t } from '../common/index.mjs';

/**
 * Common lookup for the FileSystem's [IndexedDB:IDBDatabase] storage structure.
 */
export function DbLookup(db: IDBDatabase) {
  return {
    path(path: string) {
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);
      return IndexedDb.record.get<t.PathRecord>(store, path);
    },

    async paths() {
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);

      /**
       * TODO 🐷
       */
      return IndexedDb.record.getAll<t.PathRecord>(store);
    },

    dir(path: string) {
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);
      const index = store.index(NAME.INDEX.DIRS);
      const { dir } = Path.parts(`${Path.trimSlashesEnd(path)}/`);
      return IndexedDb.record.get<t.PathRecord>(index, [dir]);
    },
  };
}
