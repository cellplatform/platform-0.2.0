import { Value } from '../common/index.mjs';

export { expect, expectError } from 'sys.test';
export { describe, it, beforeEach } from 'vitest';
export * from '../common/index.mjs';

/**
 * Generate a random port.
 */
export const randomPort = () => {
  const random = (min = 0, max = 9) => Value.random(min, max);
  return Value.toNumber(`${random(6, 9)}${random()}${random()}${random()}`);
};
