import {
  assertArrayIncludes,
  assertEquals,
  assertGreater,
  assertGreaterOrEqual,
} from '@std/assert';

/**
 * Assertion helpers.
 */
export const Expect = {
  eql: assertEquals,
  greater: assertGreater,
  greaterOrEqual: assertGreaterOrEqual,

  Array: {
    includes: assertArrayIncludes,
  },
} as const;
