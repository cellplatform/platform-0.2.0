import { Spec } from 'sys.fs.spec';
import { FsIndexedDb } from './index.mjs';
import { describe, it, slug, t, MemoryMock, expect } from './TEST/index.mjs';

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

  // Spec.every({ factory, describe, it });
  Spec.Driver.IO.every({ factory, describe, it });
  // Spec.Driver.Indexer.every({ factory, describe, it });

});
