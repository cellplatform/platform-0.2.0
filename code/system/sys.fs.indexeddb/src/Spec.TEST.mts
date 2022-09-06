import { Spec } from '../../sys.fs/src/Spec.mjs';
import { FsIndexedDb } from './index.mjs';
import { describe, slug, t } from './TEST/index.mjs';

describe('FsDriver (IndexedDb)', () => {
  const factory: t.FsDriverFactory = async (dir) => {
    const id = `fs:test.${slug()}`;
    const db = await FsIndexedDb({ id, dir });
    return db.driver;
  };

  Spec.every(factory);
});
