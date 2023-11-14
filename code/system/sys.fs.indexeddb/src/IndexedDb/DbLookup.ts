import { NAME, Path, t } from '../common';
import { IndexedDb } from './IndexedDb';

/**
 * Common lookup for the FileSystem's [IndexedDB:IDBDatabase] storage structure.
 */
export function DbLookup(db: IDBDatabase) {
  return {
    path(path: string) {
      path = formatPath(path);
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);
      return IndexedDb.Record.get<t.PathRecord>(store, path);
    },

    async paths() {
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);

      /**
       * TODO 🐷
       */
      return IndexedDb.Record.getAll<t.PathRecord>(store);
    },

    dir(path: string) {
      path = formatPath(path);
      const tx = db.transaction([NAME.STORE.PATHS], 'readonly');
      const store = tx.objectStore(NAME.STORE.PATHS);
      const index = store.index(NAME.INDEX.DIRS);
      const { dir } = Path.parts(`${Path.trimSlashesEnd(path)}/`);
      return IndexedDb.Record.get<t.PathRecord>(index, [dir]);
    },
  };
}

/**
 * Helpers
 */

function formatPath(path: string) {
  return Path.trimFilePrefix(path);
}
