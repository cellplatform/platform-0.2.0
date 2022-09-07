import { ManifestHash } from '../Manifest/index.mjs';
import { describe, expect, it } from '../TEST/index.mjs';
import { MemoryMock } from './index.mjs';

const MockIndexer = MemoryMock.Indexer;

/**
 * NOTE: The remainder of the mock is deeply tested via the
 *       standardised 🌳[sys.fs.spec] module.
 *
 *       See 🌳[sys.fs.spec] for the full test suite, which has
 *       an incoming dependency on this the base [sys.fs] module.
 */

describe('MemoryMock: Indexer (mocking helpers)', () => {
  describe('manifest', () => {
    it('mock: inject files', async () => {
      const png = MemoryMock.randomFile(50);
      const mock = MockIndexer().onManifestRequest((e) => {
        e.addFile('zoo.jpg')
          .addFile('/foo/bar.png')
          .addFile('foo/bar.png', png.data) // NB: repeat - file replaced
          .addFile('apple.txt', MemoryMock.randomFile().data);
      });

      const res = await mock.driver.manifest();
      expect(mock.count.manifest).to.eql(1);

      expect(res.kind).to.eql('dir');
      expect(res.files.length).to.eql(3);
      expect(res.files.map((e) => e.path)).to.eql(['apple.txt', 'foo/bar.png', 'zoo.jpg']);
      expect(res.files[1].filehash).to.eql(png.hash);
      expect(res.hash.files).to.eql(ManifestHash.files(res.files));
      expect(res.hash).to.eql(ManifestHash.dir(res.dir, res.files));
    });

    it('mock: inject files - options{ dir, filter }', async () => {
      const file = MemoryMock.randomFile(50);
      const mock = MockIndexer().onManifestRequest((e) => {
        e.addFile('zoo.jpg')
          .addFile('/foo/bar.png', file.data)
          .addFile('foo/baz.jpg', file.data) // NB: repeat - replace
          .addFile('apple.txt');
      });

      const res1 = await mock.driver.manifest({});
      const res2 = await mock.driver.manifest({ dir: 'foo' });
      const res3 = await mock.driver.manifest({ dir: '/foo' });
      const res4 = await mock.driver.manifest({
        dir: '/foo',
        filter: ({ path }) => path.endsWith('.jpg'),
      });

      expect(res1.files.length).to.eql(4);
      expect(res2.files.length).to.eql(2);
      expect(res3.files.length).to.eql(2);
      expect(res4.files.length).to.eql(1);

      expect(res2.files).to.eql(res3.files);
      expect(res2.files.every((file) => file.path.startsWith('foo/'))).to.eql(true);
      expect(res4.files[0].path).to.eql('foo/baz.jpg');
    });

    it('mock: read from IO { state }', async () => {
      const driver = MemoryMock.create().driver;
      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile();

      const m1 = await driver.indexer.manifest();
      expect(m1.files).to.eql([]);

      await driver.io.write('path:/a.png', file1.data);
      await driver.io.write('path:foo/b.jpg', file2.data);

      const m2 = await driver.indexer.manifest();
      expect(m2.files.length).to.eql(2);

      expect(m2.files[0].filehash).to.eql(file1.hash);
      expect(m2.files[1].filehash).to.eql(file2.hash);

      expect(m2.files[0].path).to.eql('a.png');
      expect(m2.files[1].path).to.eql('foo/b.jpg');

      const m3 = await driver.indexer.manifest({ dir: 'foo' });
      expect(m3.files.length).to.eql(1);
      expect(m3.files[0].path).to.eql('foo/b.jpg');

      // NB: "dir" filter not a directory.
      const m4 = await driver.indexer.manifest({ dir: 'foo/b.jpg' });
      expect(m4.files).to.eql([]);
    });
  });
});
