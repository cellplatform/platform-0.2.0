import { Test, describe, it } from '.';
import { TESTS } from '../test.ui/-TestRunner.tests.mjs';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);
const wait = TESTS.all.map((m) => {
  if (typeof m === 'object') run.suite(m);
});
await Promise.all(wait);

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
