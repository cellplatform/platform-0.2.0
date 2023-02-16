import { Test, describe, it } from '.';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);

await run.suite(import('../driver.Automerge/-dev/TEST.basic.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.api.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.filesystem.mjs'));
await run.suite(import('../driver.Automerge/-dev/TEST.sync.mjs'));
