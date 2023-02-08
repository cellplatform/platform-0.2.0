import { Test } from 'sys.test.spec';
import { describe, it } from '../test';

/**
 * Run tests within CI (server-side).
 */
const transform = Test.using(describe, it);
const suite = (await import('./Automerge.lib.TEST.mjs')).default;

await transform.suite(suite);
