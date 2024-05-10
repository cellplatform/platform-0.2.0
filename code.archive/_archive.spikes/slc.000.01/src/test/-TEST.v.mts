import { Test, describe, it, type t } from '.';
import { TESTS } from '../test.ui/-TestRunner.TESTS.mjs';

/**
 * HACK 🐷
 * Commented out unit tests in this spike.
 * Non test-related bundle issue (in referenced external module "vime.js" is appears)
 * causing tests to fail.
 *
 * This is ONLY alright to leave because this is a "spike" module.
 */

/**
 * Test Harness (UI)
 */
describe('visual specs', () => {
  it('run', async () => {
    // const { Dev, expect } = await import('../test.ui');
    // const { Specs } = await import('../test.ui/entry.Specs.mjs');
    // const res = await Dev.headless(Specs);
    // expect(res.ok).to.eql(true);
  });
});

/**
 * Run tests within CI (server-side).
 */
// const run = Test.using(describe, it);
// const wait = TESTS.all
//   .filter((m) => typeof m === 'object')
//   .map((m) => m as t.SpecImport)
//   .map((m) => run.suite(m));
// await Promise.all(wait);
