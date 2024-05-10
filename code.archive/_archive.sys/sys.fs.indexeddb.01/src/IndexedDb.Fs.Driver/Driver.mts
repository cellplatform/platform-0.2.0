import { Subject } from 'rxjs';

import { NAME, ROOT_DIR, t } from '../common';
import { IndexedDb } from '../IndexedDb';
import { FsIO } from './Driver.IO.mjs';
import { FsIndexer } from './Driver.Indexer.mjs';

type DirPath = string;
type FilesystemId = string;

/**
 * DRIVER
 * A filesystem driver running against the browser [IndexedDB] store.
 */
export const IndexedDbDriver = (options: { id?: FilesystemId; dir?: DirPath } = {}) => {
  const dir = options.dir ?? ROOT_DIR;
  const id = (options.id ?? 'fs').trim();

  return IndexedDb.init<t.FsIndexedDb>({
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
      let _io: t.FsIO | undefined;
      let _indexer: t.FsIndexer | undefined;

      /**
       * API.
       */
      const api: t.FsIndexedDb = {
        id,
        version,
        dispose$: dispose$.asObservable(),
        dispose,
        database: db,
        driver: {
          get io() {
            return _io || (_io = FsIO({ dir, db }));
          },
          get indexer() {
            return _indexer || (_indexer = FsIndexer({ dir, db }));
          },
        },
      };

      return api;
    },
  });
};
