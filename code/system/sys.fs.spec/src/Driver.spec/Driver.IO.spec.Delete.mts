import { expect, MemoryMock, t } from './common.mjs';

export const DeleteSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('delete', () => {
    it('nothing to delete', async () => {
      const driver = (await factory()).io;

      const uri = 'path:foo/bar.png';
      const file = MemoryMock.randomFile();
      await driver.write(uri, file.data);

      const res = await driver.delete(uri);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);

      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png']);
    });

    it('single file', async () => {
      const mock = MemoryMock.IO();

      const path = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();
      await mock.driver.write(path, png.data);

      const res = await mock.driver.delete(path);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png']);
    });

    it('many files', async () => {
      const mock = MemoryMock.IO();

      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile(500);
      await mock.driver.write('path:foo/bar.png', file1.data);
      await mock.driver.write('path:thing.pdf', file2.data);

      const res = await mock.driver.delete(['path:foo/bar.png', 'path:404', 'path:thing.pdf']);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png', 'path:thing.pdf']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png', 'file:///mock/thing.pdf']);
    });
  });
};
