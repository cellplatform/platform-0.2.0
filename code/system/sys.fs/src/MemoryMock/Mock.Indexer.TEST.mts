import { describe, it, expect } from '../TEST/index.mjs';
import { FsMockIndexer, MemoryMock } from './index.mjs';
import { ManifestHash } from '../Manifest/index.mjs';

describe('Mock: FsIndexer', () => {
  describe('dir', () => {
    it('default', () => {
      const mock = FsMockIndexer();
      expect(mock.indexer.dir).to.eql('/mock/');
    });

    it('custom', () => {
      const mock = FsMockIndexer({ dir: '/foo/bar/' });
      expect(mock.indexer.dir).to.eql('/foo/bar/');
    });
  });

  describe('manifest', () => {
    it('default no files', async () => {
      const mock = FsMockIndexer();
      const res = await mock.indexer.manifest();
      expect(mock.count.manifest).to.eql(1);

      expect(typeof res.dir.indexedAt).to.eql('number');
      expect(res.kind).to.eql('dir');
      expect(res.hash).to.eql(ManifestHash.dir(res.dir, res.files));
      expect(res.files).to.eql([]);
    });

    it('inject files', async () => {
      const png = MemoryMock.randomFile(50);
      const mock = FsMockIndexer().onManifest((e) => {
        e.addFile('zoo.jpg')
          .addFile('/foo/bar.png')
          .addFile('foo/bar.png', png.data) // NB: repeat - file replaced
          .addFile('apple.txt', MemoryMock.randomFile().data);
      });

      const res = await mock.indexer.manifest();
      expect(mock.count.manifest).to.eql(1);

      expect(res.kind).to.eql('dir');
      expect(res.files.length).to.eql(3);
      expect(res.files.map((e) => e.path)).to.eql(['apple.txt', 'foo/bar.png', 'zoo.jpg']);
      expect(res.files[1].filehash).to.eql(png.hash);
      expect(res.hash.files).to.eql(ManifestHash.files(res.files));
      expect(res.hash).to.eql(ManifestHash.dir(res.dir, res.files));
    });

    it('inject files: options{ dir, filter }', async () => {
      const file = MemoryMock.randomFile(50);
      const mock = FsMockIndexer().onManifest((e) => {
        e.addFile('zoo.jpg')
          .addFile('/foo/bar.png', file.data)
          .addFile('foo/baz.jpg', file.data) // NB: repeat - replace
          .addFile('apple.txt');
      });

      const res1 = await mock.indexer.manifest({});
      const res2 = await mock.indexer.manifest({ dir: 'foo' });
      const res3 = await mock.indexer.manifest({ dir: '/foo' });
      const res4 = await mock.indexer.manifest({
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
  });
});
