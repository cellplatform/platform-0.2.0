import { expect, t, Path } from './common.mjs';

export const DirSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory, root } = ctx;

  describe('dir', () => {
    it('default', async () => {
      const driver = await factory();
      expect(driver.indexer.dir).to.eql(root);
    });

    it('custom', async () => {
      const driver = await factory('foo/bar');
      expect(driver.indexer.dir).to.eql(Path.join(root, '/foo/bar/'));
    });
  });
};
