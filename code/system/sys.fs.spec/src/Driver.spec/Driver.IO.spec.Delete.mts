import { expect, MemoryMock, t, Path } from './common';

export const DeleteSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory, root } = ctx;
  const toLocation = (path: string) => Path.toAbsoluteLocation(path, { root });

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
      expect(res.locations).to.eql([toLocation('/foo/bar.png')]);
    });

    it('single file', async () => {
      const driver = (await factory()).io;
      const uri = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();
      await driver.write(uri, png.data);

      const res = await driver.delete(uri);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql([toLocation('/foo/bar.png')]);
    });

    it('many files', async () => {
      const driver = (await factory()).io;

      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile(500);
      await driver.write('path:foo/bar.png', file1.data);
      await driver.write('path:thing.pdf', file2.data);

      const res = await driver.delete(['path:foo/bar.png', 'path:404', 'path:thing.pdf']);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png', 'path:thing.pdf']);
      expect(res.locations).to.eql([toLocation('/foo/bar.png'), toLocation('thing.pdf')]);
    });
  });
};
