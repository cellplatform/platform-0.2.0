import { Test, describe, it } from '.';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);

await run.suite(import('../driver.Automerge/-dev/TEST.basic.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.api.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.filesystem.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.sync.mjs'));
await run.suite(import('../crdt.Sync/-TEST.DocSync.mjs'));
await run.suite(import('../crdt.Sync/-TEST.PeerSyncer.mjs'));
await run.suite(import('../crdt.DocRef/-TEST.mjs'));
await run.suite(import('../crdt.DocFile/-TEST.mjs'));
await run.suite(import('../crdt.Is/-TEST.mjs'));

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
