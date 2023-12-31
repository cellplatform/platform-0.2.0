import { Test, describe, it, type t } from '.';
import { TESTS } from '../test.ui/-TestRunner.TESTS';

/**
 * Test Harness (UI)
 */

/**
 * Run tests within CI (server-side).
 */
const run = Test.using(describe, it);
const wait = TESTS.all
  .filter((m) => typeof m === 'object')
  .map((m) => m as t.SpecImport)
  .map((m) => run.suite(m));
await Promise.all(wait);
