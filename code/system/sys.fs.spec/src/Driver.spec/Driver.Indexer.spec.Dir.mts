import { expect, t } from './common.mjs';

export const DirSpec = (ctx: t.SpecContext) => {
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
