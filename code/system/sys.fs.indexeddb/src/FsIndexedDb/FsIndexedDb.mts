import { Subject } from 'rxjs';

import { NAME, ROOT_DIR, t } from '../common/index.mjs';
import { IndexedDb } from '../IndexedDb/index.mjs';
import { FsDriver } from '../IndexedDb.Driver/index.mjs';
import { FsIndexer } from '../IndexedDb.Indexer/index.mjs';

type DirPath = string;
type FilesystemId = string;

/**
 * A filesystem driver running against the browser [IndexedDB] store.
 */
export const FsIndexedDb = (options: { id?: FilesystemId; dir?: DirPath } = {}) => {
  const dir = options.dir ?? ROOT_DIR;
  const id = (options.id ?? 'fs').trim();

  const db = IndexedDb.create<t.FsIndexedDb>({
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
      let _io: t.FsDriverIO | undefined;
      let _indexer: t.FsIndexer | undefined;

      /**
       * API.
       */
      const api: t.FsIndexedDb = {
        id,
        version,
        dispose$: dispose$.asObservable(),
        dispose,
        driver: {
          get io() {
            return _io || (_io = FsDriver({ dir, db }));
          },
          get indexer() {
            const fs = api.driver.io;
            return _indexer || (_indexer = FsIndexer({ dir, db, fs }));
          },
        },
      };

      return api;
    },
  });

  return db;
};
