import { describe, it } from 'vitest';

import { MemoryMock, t } from './common/index.mjs';
import { FilesystemSpec } from './Spec.mjs';

describe('Filesystem (Spec)', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir);
  FilesystemSpec.every({ describe, it, factory });
});
