import { expect, t, Path } from './common';

export const ResolveSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory, root } = ctx;

  describe('resolve', () => {
    it('default root directory', async () => {
      const driver = (await factory()).io;
      const res = driver.resolve('path:.');
      expect(res).to.eql(Path.ensureSlashes(root));
    });

    it('custom root directory', async () => {
      const driver = (await factory('  foo/bar  ')).io;

      const res1 = driver.resolve('path:.');
      const res2 = driver.resolve('path:dir/file.txt');

      expect(res1).to.eql(Path.join(root, '/foo/bar/'));
      expect(res2).to.eql(Path.join(root, '/foo/bar/dir/file.txt'));
    });
  });
};
