import { expect, expectError, MemoryMock, t, Path } from './common';

export const ReadWriteSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory, root } = ctx;

  const toLocation = (path: string) => Path.toAbsoluteLocation(path, { root });

  describe('read/write', () => {
    it('write', async () => {
      const driver = (await factory()).io;
      const uri = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();

      const res = await driver.write(uri, png.data);

      expect(res.uri).to.eql('path:foo/bar.png');
      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.file.data).to.eql(png.data);
      expect(res.file.hash).to.eql(png.hash);
      expect(res.file.path).to.eql('/foo/bar.png');
      expect(res.file.location).to.eql(toLocation('/foo/bar.png'));
      expect(res.error).to.eql(undefined);
    });

    it('read: not found (404)', async () => {
      const driver = (await factory()).io;
      const uri = '  path:/foo/bar.png  ';
      const res = await driver.read(uri);

      expect(res.uri).to.eql('path:/foo/bar.png');
      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.file).to.eql(undefined);
      expect(res.error?.code).to.eql('fs:read');
      expect(res.error?.path).to.eql('/foo/bar.png');
    });

    it('read (200)', async () => {
      const driver = (await factory()).io;
      const uri = 'path:foo/bar.png';
      const png = MemoryMock.randomFile();

      await driver.write(uri, png.data);

      const res = await driver.read(uri);

      expect(res.uri).to.eql(uri);
      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.file?.data).to.eql(png.data);
      expect(res.file?.hash).to.eql(png.hash);
      expect(res.file?.path).to.eql('/foo/bar.png');
      expect(res.file?.location).to.eql(toLocation('foo/bar.png'));
      expect(res.error).to.eql(undefined);
    });

    it('write/read - remove leading slash', async () => {
      const driver = (await factory()).io;
      const file = MemoryMock.randomFile();

      await driver.write('path:/foo/bar.txt', file.data);

      const res = await driver.read('path:foo/bar.txt');
      expect(res.status).to.eql(200);
    });

    it('exception: no data', async () => {
      const driver = (await factory()).io;
      const fn = () => driver.write('path:foo/bird.png', undefined as any);
      expectError(fn, 'No data');
    });
  });
};
