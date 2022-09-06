import { describe, it } from 'vitest';

import { t, MemoryMock } from './common/index.mjs';
import { FsDriverSpec } from './Driver.spec/index.mjs';

describe('Filesystem Driver', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir);
  FsDriverSpec.every({ describe, it, factory });
});
