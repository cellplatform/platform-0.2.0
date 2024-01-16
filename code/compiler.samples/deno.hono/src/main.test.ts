import { assertEquals } from './common.ts';

/**
 * https://docs.deno.com/runtime/manual/basics/testing/
 */
Deno.test('Sample', (_e) => {
  assertEquals(123, 123);
});
