import { Test, describe, it, type t } from '.';
import { TESTS } from '../test.ui/-TestRunner.TESTS';

/**
 * Test Harness (UI)
 */
describe('visual specs', () => {
  it('run', async () => {
    const { Dev, expect } = await import('../test.ui');
    const { Specs } = await import('../test.ui/entry.Specs');
    const res = await Dev.headless(Specs);
    expect(res.ok).to.eql(true);
  });
});

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);
const wait = TESTS.all
  .filter((m) => typeof m === 'object')
  .map((m) => m as t.SpecImport)
  .map((m) => run.suite(m));
await Promise.all(wait);
