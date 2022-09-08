import { Spec } from 'sys.fs.spec';

import { FsIndexedDb } from './index.mjs';
import { expect, Path, describe, it, MemoryMock, slug, t } from './TEST/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('FsDriver (IndexedDb) - functional specification', () => {
  const root = MemoryMock.DEFAULT.rootdir;

  const factory: t.FsDriverFactory = async (dir) => {
    dir = Path.join(root, Path.trim(dir));
    const id = `fs:test.${slug()}`;
    const db = await FsIndexedDb({ id, dir });
    return db.driver;
  };

  Spec.every({ factory, describe, it, root });
});
