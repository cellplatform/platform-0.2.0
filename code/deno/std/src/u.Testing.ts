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
  /* Assert eqaulity. */
  eql: assertEquals,

  /* Assert greater than. */
  greater: assertGreater,

  /* Assert greater or equal than. */
  greaterOrEqual: assertGreaterOrEqual,

  /* Helpers for asserting truth about arrays. */
  Array: {
    /* Assert an item exists within the array. */
    includes: assertArrayIncludes,
  },
} as const;
