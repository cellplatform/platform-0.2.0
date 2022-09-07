export { expect, expectError } from 'sys.test';
export { describe, it } from 'vitest';
export { MemoryMock } from 'sys.fs';

import { Path } from '../common/index.mjs';

export const TEST_PATH = {
  tmp: Path.join(__dirname, '../../tmp'),
};
