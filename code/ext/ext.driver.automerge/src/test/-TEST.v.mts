import { describe, expect, it } from '.';

describe('ext.driver.automerge', () => {
  it('module', async () => {
    const { Pkg } = await import('../index.pkg.mjs');
    expect(Pkg.name).to.eql('ext.driver.automerge');
  });
});
