import { t, ManifestHash, expect, MemoryMock } from './common';

export const ManifestSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('manifest', () => {
    it('no files', async () => {
      const driver = await factory();
      const res = await driver.indexer.manifest();

      expect(typeof res.dir.indexedAt).to.eql('number');
      expect(res.kind).to.eql('dir');
      expect(res.hash).to.eql(ManifestHash.dir(res.dir, res.files));
      expect(res.files).to.eql([]);
    });

    it('with files', async () => {
      const driver = await factory();
      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile();

      const m1 = await driver.indexer.manifest();
      expect(m1.files).to.eql([]);

      await driver.io.write('path:/a', file1.data);
      await driver.io.write('path:foo/b', file2.data);

      const m2 = await driver.indexer.manifest();
      expect(m2.files.length).to.eql(2);

      expect(m2.files[0].filehash).to.eql(file1.hash);
      expect(m2.files[1].filehash).to.eql(file2.hash);

      expect(m2.files[0].path).to.eql('a');
      expect(m2.files[1].path).to.eql('foo/b');
    });

    it('dot files (eg. ".hidden")', async () => {
      const driver = await factory();
      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile();

      const m1 = await driver.indexer.manifest();
      expect(m1.files).to.eql([]);

      await driver.io.write('path:/.hidden-file', file1.data);
      await driver.io.write('path:foo/.hidden-dir/file', file2.data);

      const m2 = await driver.indexer.manifest();
      expect(m2.files.length).to.eql(2);
      expect(m2.files[0].path).to.eql('.hidden-file');
      expect(m2.files[1].path).to.eql('foo/.hidden-dir/file');
    });

    describe('sub-directory: manifest({ dir })', () => {
      it('filter on directory', async () => {
        const driver = await factory();
        const file1 = MemoryMock.randomFile();
        const file2 = MemoryMock.randomFile();
        const file3 = MemoryMock.randomFile();

        await driver.io.write('path:/a', file1.data);
        await driver.io.write('path:foo/b', file2.data);
        await driver.io.write('path:foo/c', file3.data);

        const m1 = await driver.indexer.manifest();
        const m2 = await driver.indexer.manifest({ dir: '  ///foo ' });

        expect(m1.files.length).to.eql(3);
        expect(m2.files.length).to.eql(2);
        expect(m2.files.map((item) => item.path)).to.eql(['foo/b', 'foo/c']);
      });

      it('invalid directory filter (path not a folder)', async () => {
        const driver = await factory();
        const file = MemoryMock.randomFile();

        await driver.io.write('path:a.png', file.data);
        await driver.io.write('path:foo/a.png', file.data);
        await driver.io.write('path:foo/b.png', file.data);

        const m1 = await driver.indexer.manifest({ dir: 'foo' });
        const m2 = await driver.indexer.manifest({ dir: 'foo/b.png' });
        const m3 = await driver.indexer.manifest({ dir: 'foo/bar/404' });

        expect(m1.files.length).to.eql(2);
        expect(m2.files.length).to.eql(0);
        expect(m3.files.length).to.eql(0);
      });
    });

    it('natural sort (filename)', async () => {
      const driver = await factory();
      const file = MemoryMock.randomFile();

      const unsorted = ['z1.d', 'z10.d', 'z17.d', 'a999.d', 'z2.d', 'z23.d', 'z3.d'];
      const sorted = ['a999.d', 'z1.d', 'z2.d', 'z3.d', 'z10.d', 'z17.d', 'z23.d'];

      for (const name of unsorted) {
        await driver.io.write(`path:${name}`, file.data);
      }

      const m = await driver.indexer.manifest();
      const names = m.files.map((item) => item.path);
      expect(names).to.eql(sorted);
    });
  });
};
