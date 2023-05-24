import { describe, Test, it } from '.';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);
// await run.suite(import('../'));

describe('visual specs', () => {
  it(
    'run',
    async () => {
      const { Dev, expect } = await import('../test.ui');
      const { Specs } = await import('../test.ui/entry.Specs.mjs');
      const res = await Dev.headless(Specs);
      expect(res.ok).to.eql(true);
    },
    { timeout: 1000 * 10 },
  );
});
