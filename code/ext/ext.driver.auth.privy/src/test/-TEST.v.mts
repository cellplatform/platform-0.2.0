import { describe, it } from '.';

/**
 * Test Harness (UI)
 */
describe('visual specs', () => {
  it('run', async () => {
    const { Dev, expect } = await import('../test.ui');
    const { Specs } = await import('../test.ui/entry.Specs.mjs');
    const res = await Dev.headless(Specs);
    expect(res.ok).to.eql(true);
  });
});
