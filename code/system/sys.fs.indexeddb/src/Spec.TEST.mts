import { FsSpec } from 'sys.fs.spec';
import { FsIndexedDb } from './index.mjs';
import { describe, it, slug, t } from './TEST/index.mjs';

describe('FsDriver (IndexedDb)', () => {
  const factory: t.FsDriverFactory = async (dir) => {
    dir = dir ?? '/mock';
    const id = `fs:test.${slug()}`;
    const db = await FsIndexedDb({ id, dir });
    return db.driver;
  };

  FsSpec.every({ factory, describe, it });
});
