import { expect, MemoryMock, t } from './common';

export const CopySpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('copy', () => {
    it('copy file', async () => {
      const driver = (await factory()).io;
      const png = MemoryMock.randomFile();

      await driver.write('path:foo.png', png.data);
      const res = await driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error).to.eql(undefined);

      // Ensure the file is copied.
      const from = await driver.read('path:foo.png');
      const to = await driver.read('path:images/bird.png');

      expect(from.status).to.eql(200);
      expect(to.status).to.eql(200);

      expect(from.file?.hash).to.eql(png.hash);
      expect(to.file?.hash).to.eql(png.hash);
    });

    it('404 - source not found', async () => {
      const driver = (await factory()).io;
      const res = await driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error?.code).to.eql('fs:copy');
      expect(res.error?.path).to.eql('foo.png');
      expect(res.error?.message).to.include('Source file not found');
    });
  });
};
