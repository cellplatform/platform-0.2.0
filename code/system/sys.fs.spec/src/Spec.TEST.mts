import { describe, it } from 'vitest';

import { MemoryMock, t } from './common/index.mjs';
import { Spec } from './Spec.mjs';

describe('Filesystem (Spec)', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir).driver;
  Spec.every({ describe, it, factory });
});
