import { expect, MemoryMock, t } from './common';

export const ExceptionsSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('throw on step-up out of root directory', () => {
    it('read', async () => {
      const driver = (await factory()).io;
      const png = MemoryMock.randomFile();
      await driver.write('path:foo.png', png.data);

      const res1 = await driver.read('path:foo.png');
      expect(res1.ok).to.eql(true);

      const res2 = await driver.read('path:../foo.png');
      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Path out of scope');
    });

    it('write', async () => {
      const driver = (await factory()).io;

      const png = MemoryMock.randomFile();

      const res = await driver.write('path:../foo.png', png.data);

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(422);
      expect(res.error?.message).to.include('Path out of scope');
    });

    it('delete', async () => {
      const driver = (await factory()).io;

      const res1 = await driver.delete('path:../foo.png');
      const res2 = await driver.delete(['path:../foo.png', 'path:bar.png', 'path:../../bar.png']);

      expect(res1.ok).to.eql(false);
      expect(res1.status).to.eql(422);
      expect(res1.error?.message).to.include('Path out of scope');
      expect(res1.error?.path).to.include('../foo.png');

      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Path out of scope');
      expect(res2.error?.path).to.include('../foo.png; ../../bar.png');
    });

    it('copy', async () => {
      const driver = (await factory()).io;

      const res1 = await driver.copy('path:../foo.png', 'path:foo.png');
      const res2 = await driver.copy('path:foo.png', 'path:../foo.png');

      expect(res1.ok).to.eql(false);
      expect(res1.status).to.eql(422);
      expect(res1.error?.message).to.include('Source path out of scope');
      expect(res1.error?.path).to.include('../foo.png');

      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Target path out of scope');
      expect(res2.error?.path).to.include('../foo.png');
    });
  });
};
