import { Test, describe, it, type t } from '.';

describe.skip('visual specs', () => {});

/**
 * Test Harness (UI)
 */
// describe('visual specs', () => {
//   it('run', async () => {
//     const { Dev, expect } = await import('../test.ui');
//     const { Specs } = await import('../test.ui/entry.Specs.mjs');
//     const res = await Dev.headless(Specs);
//     expect(res.ok).to.eql(true);
//   });
// });

/**
 * Run tests within CI (server-side).
 */
// const run = Test.using(describe, it);
// const tests = [import('../common/Is.TEST')];
// const wait = tests
//   .filter((m) => typeof m === 'object')
//   .map((m) => m as t.SpecImport)
//   .map((m) => run.suite(m));
// await Promise.all(wait);
