import { describe, it, expect, MemoryMock, TEST_PATH, expectError } from '../TEST/index.mjs';
import { FsDriver } from './index.mjs';
export { slug } from '../common/index.mjs';
import { NodeFs } from '../node/NodeFs/index.mjs';

describe('FsDriver (Node)', () => {
  const testCreate = async () => {
    const dir = TEST_PATH.tmp;
    await NodeFs.ensureDir(dir);

    const driver = FsDriver({ dir });
    const sample = MemoryMock.randomFile();

    return { driver, sample };
  };

  describe('paths', () => {
    it('default', () => {
      const driver = FsDriver();
      expect(driver.dir).to.eql('/');
    });

    it('custon root directory', () => {
      const driver = FsDriver({ dir: ' foo/bar// ' });
      expect(driver.dir).to.eql('/foo/bar/');
    });

    it('resolve: cannot step above root directory (security)', async () => {
      const { driver } = await testCreate();
      const length = driver.dir.split('/').length;
      const uri = `path:${'../'.repeat(length + 3)}`;
      expect(driver.resolve(uri)).to.eql(driver.dir);
    });
  });

  describe('info', () => {
    it('throw: not a "path:.." URI', async () => {
      const { driver } = await testCreate();
      const fn = () => driver.info('foo/bar.png');
      await expectError(fn, 'Invalid URI');
    });

    it('root directory', async () => {
      const { driver } = await testCreate();
      const uri = 'path:/';
      const res = await driver.info(` ${uri}  `);

      expect(res.uri).to.eql('path:/');
      expect(res.exists).to.eql(true);
      expect(res.kind).to.eql('dir');
      expect(res.location).to.eql(`file://${driver.dir}`);
      expect(res.path).to.eql('/');
      expect(res.hash).to.eql(''); // No hashing for directory.
      expect(res.bytes).to.eql(-1); // Byte size for file only.
    });
  });
});
