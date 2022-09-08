import { describe, it } from 'vitest';

import { MemoryMock, t } from './common/index.mjs';
import { Spec } from './Spec.mjs';

describe('Run specification (against sys.fs::MemoryMock)', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir).driver;
  const ctx: t.SpecContext = { describe, it, factory };
  Spec.every(ctx);
});
