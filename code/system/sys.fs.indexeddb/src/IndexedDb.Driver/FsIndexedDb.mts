import { Subject } from 'rxjs';

import { NAME, ROOT_DIR, t } from '../common/index.mjs';
import { IndexedDb } from '../IndexedDb/index.mjs';
import { FsDriver } from './FsDriver.mjs';
import { FsIndexer } from '../IndexedDb.Indexer/index.mjs';

/**
 * A filesystem driver running against the browser [IndexedDB] store.
 */
export const FsIndexedDb = (args: { id?: string }) => {
  const dir = ROOT_DIR;
  const id = (args.id ?? 'fs').trim();

  return IndexedDb.create<t.FsIndexedDb>({
    name: id,
    version: 1,

    /**
     * Initialize the database schema.
     */
    schema(req, e) {
      const db = req.result;
      const store = {
        paths: db.createObjectStore(NAME.STORE.PATHS, { keyPath: 'path' }),
        files: db.createObjectStore(NAME.STORE.FILES, { keyPath: 'hash' }),
      };
      store.paths.createIndex(NAME.INDEX.DIRS, ['dir']);
      store.paths.createIndex(NAME.INDEX.HASH, ['hash']);
    },

    /**
     * The database driver API implementation.
     */
    store(db) {
      const dispose$ = new Subject<void>();
      const dispose = () => {
        db.close();
        dispose$.next();
        dispose$.complete();
      };

      const { version } = db;
      let _driver: t.FsDriver | undefined;
      let _index: t.FsIndexer | undefined;

      /**
       * API.
       */
      const api: t.FsIndexedDb = {
        id,
        version,
        dispose$: dispose$.asObservable(),
        dispose,
        get driver() {
          return _driver || (_driver = FsDriver({ dir, db }));
        },
        get indexer() {
          const fs = api.driver;
          return _index || (_index = FsIndexer({ dir, db, fs }));
        },
      };

      return api;
    },
  });
};
