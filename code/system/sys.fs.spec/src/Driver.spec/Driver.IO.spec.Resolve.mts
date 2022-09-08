import { expect, t } from './common.mjs';

export const ResolveSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;
  describe('resolve', () => {
    it('default root directory', async () => {
      const driver = (await factory()).io;
      const resolve = driver.resolve;
      expect(resolve('path:.')).to.eql('/mock/');
    });

    it('custom root directory', async () => {
      const driver = (await factory('  foo/bar  ')).io;
      const resolve = driver.resolve;

      const res1 = resolve('path:.');
      const res2 = resolve('path:dir/file.txt');

      expect(res1).to.eql('/foo/bar/');
      expect(res2).to.eql('/foo/bar/dir/file.txt');
    });
  });
};
