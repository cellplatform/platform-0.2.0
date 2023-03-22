import { Test, describe, it } from '../test';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);

await run.suite(import('../test.ui/-dev.mocks/-TEST.mjs'));
await run.suite(import('../ui/ui.PeerCard/-dev/Schema.TEST.mjs'));
