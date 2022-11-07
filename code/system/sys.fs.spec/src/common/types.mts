/**
 * @external
 */
export type {
  SuiteAPI as SpecSuite, // aka. "describe"
  TestAPI as SpecTest, //   aka. "it"
} from 'vitest';

/**
 * @system
 */
export type { FsDriverFactory } from 'sys.fs/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';
