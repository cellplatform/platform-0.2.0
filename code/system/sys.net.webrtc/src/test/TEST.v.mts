import { Test, describe, it } from '../test';

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);

await run.suite(import('../sys.data.crdt.PeerSync/PeerSyncer.TEST.mjs')); // TEMP, move to CRDT 🐷
await run.suite(import('../WebRTC.dev/Mock.TEST.mjs'));
