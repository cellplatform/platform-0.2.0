import {
  assertEquals,
  assertArrayIncludes,
  assertGreater,
  assertGreaterOrEqual,
} from 'jsr:@std/assert@1.0.4';

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
