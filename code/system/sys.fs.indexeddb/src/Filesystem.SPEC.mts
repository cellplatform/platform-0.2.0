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

  /**
   * TODO 🐷 - delete
   */
  it('TMP', async () => {
    // const driver = (await factory()).io;
    // const png = MemoryMock.randomFile();
    // await driver.write('path:foo.png', png.data);
    // const res1 = await driver.read('path:foo.png');
    // expect(res1.ok).to.eql(true);
    // const res2 = await driver.read('path:../foo.png');
    // console.log('-------------------------------------------');
    // console.log('res2', res2);
    // expect(res2.ok).to.eql(false);
    // expect(res2.status).to.eql(422);
    // expect(res2.error?.message).to.include('Path out of scope');
  });
});
