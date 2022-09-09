import { Spec } from 'sys.fs.spec';

import { IndexedDbDriver } from './index.mjs';
import { describe, it, MemoryMock, Path, slug, t } from './TEST/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('Filesystem: IndexedDB (functional specification)', () => {
  const root = MemoryMock.DEFAULT.rootdir;

  const factory: t.FsDriverFactory = async (dir) => {
    dir = Path.join(root, Path.trim(dir));
    const id = `fs:test.${slug()}`;
    const db = await IndexedDbDriver({ id, dir });
    return db.driver;
  };

  Spec.every({ factory, describe, it, root });
});
