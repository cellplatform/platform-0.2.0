import { FilesystemSpec } from 'sys.fs.spec';
import { FsIndexedDb } from './index.mjs';
import { describe, it, slug, t } from './TEST/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('FsDriver (IndexedDb) - functional specification', () => {
  const factory: t.FsDriverFactory = async (dir) => {
    dir = dir ?? '/mock';
    const id = `fs:test.${slug()}`;
    const db = await FsIndexedDb({ id, dir });
    return db.driver;
  };

  FilesystemSpec.every({ factory, describe, it });
});
