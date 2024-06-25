/**
 * @external
 */
import type { describe, it } from 'vitest';
export type Describe = typeof describe;
export type It = typeof it;

/**
 * @sys
 */
import type { expect, expectError } from './expect';
export type Expect = typeof expect;
export type ExpectError = typeof expectError;
