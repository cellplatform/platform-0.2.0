import { Path } from '../common';

export { expect, expectError } from 'sys.test';
export { describe, it, beforeEach } from 'vitest';
export { MemoryMock } from 'sys.fs';
export * from '../common';

/**
 * Constants
 */
export const TEST_PATH = {
  tmp: Path.join(__dirname, '../../tmp'),
};
