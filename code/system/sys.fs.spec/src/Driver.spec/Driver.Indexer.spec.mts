import { t, ManifestHash, expect, MemoryMock } from './common.mjs';

const DirSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('dir', () => {
    it('default', async () => {
      const driver = await factory();
      expect(driver.indexer.dir).to.eql('/mock/');
    });

    it('custom', async () => {
      const driver = await factory('foo/bar');
      expect(driver.indexer.dir).to.eql('/foo/bar/');
    });
  });
};

const ManifestSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('manifest', () => {
    it('default no files', async () => {
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

      await driver.io.write('path:a', file1.data);
      await driver.io.write('path:b', file2.data);

      const m2 = await driver.indexer.manifest();
      expect(m2.files.length).to.eql(2);

      expect(m2.files[0].filehash).to.eql(file1.hash);
      expect(m2.files[1].filehash).to.eql(file2.hash);

      expect(m2.files[0].path).to.eql('/a');
      expect(m2.files[1].path).to.eql('/b');

      expect(m2.files[0].uri).to.eql('path:/a');
      expect(m2.files[1].uri).to.eql('path:/b');
    });
  });
};

/**
 * Functional Specification: Indexer
 */
export const FsIndexerSpec = {
  DirSpec,
  ManifestSpec,

  every(ctx: t.SpecContext) {
    DirSpec(ctx);
    ManifestSpec(ctx);
  },
};
