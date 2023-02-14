import { Test } from 'sys.test.spec';
import { describe, it } from '../test';

/**
 * Run tests within CI (server-side).
 */
const transform = Test.using(describe, it);

await transform.suite(import('./-dev/TEST.basic.mjs'));
await transform.suite(import('./-dev/TEST.api.mjs'));
await transform.suite(import('./-dev/TEST.filesystem.mjs'));
await transform.suite(import('./-dev/TEST.sync.mjs'));
