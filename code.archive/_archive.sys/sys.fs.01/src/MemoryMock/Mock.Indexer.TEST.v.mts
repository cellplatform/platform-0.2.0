import { describe, expect, it } from '../test';
import { MemoryMock } from '.';

/**
 * NOTE: The remainder of the mock is deeply tested via the
 *       standardised 🌳[sys.fs.spec] module.
 *
 *       See 🌳[sys.fs.spec] for the full test suite, which has
 *       an incoming dependency on this the base [sys.fs] module.
 */

describe('MemoryMock: Indexer (mocking helpers)', () => {
  describe('manifest', () => {
    it('no files', async () => {
      const driver = MemoryMock.create().driver;
      const manifest = await driver.indexer.manifest();
      expect(manifest.files).to.eql([]);
    });

    it('files', async () => {
      const driver = MemoryMock.create().driver;
      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile();

      await driver.io.write('path:/a.png', file1.data);
      await driver.io.write('path:foo/b.jpg', file2.data);

      const manifest = await driver.indexer.manifest();
      expect(manifest.files.length).to.eql(2);

      expect(manifest.files[0].filehash).to.eql(file1.hash);
      expect(manifest.files[1].filehash).to.eql(file2.hash);

      expect(manifest.files[0].path).to.eql('a.png');
      expect(manifest.files[1].path).to.eql('foo/b.jpg');
    });

    it('filter on dir', async () => {
      const driver = MemoryMock.create().driver;
      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile();

      await driver.io.write('path:/a.png', file1.data);
      await driver.io.write('path:foo/b.jpg', file2.data);

      const m1 = await driver.indexer.manifest({ dir: 'foo' });
      expect(m1.files.length).to.eql(1);
      expect(m1.files[0].path).to.eql('foo/b.jpg');

      // NB: the "dir" filter not a directory.
      const m2 = await driver.indexer.manifest({ dir: 'foo/b.jpg' });
      expect(m2.files).to.eql([]);
    });
  });
});
