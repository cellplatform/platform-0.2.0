import { describe } from '../TEST/index.mjs';
import { FsMockDriver } from './index.mjs';
import { DriverSpec } from './Mock.Driver.spec.mjs';

describe('FsDriver (MemoryMock)', () => {
  DriverSpec.every(async (dir?: string) => FsMockDriver({ dir }).driver);
});
