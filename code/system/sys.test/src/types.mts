export type { expect, expectError } from './index.mjs';

import type { TestAPI, SuiteAPI } from 'vitest';
export type SpecSuite = SuiteAPI; // aka. "describe"
export type SpecTest = TestAPI; //   aka. "it"
