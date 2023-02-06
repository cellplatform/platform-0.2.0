import { describe, it } from 'vitest';

import { MemoryMock, t, Path } from './common';
import { Spec } from './Spec.mjs';

describe('Run specification (against sys.fs::MemoryMock)', () => {
  const root = MemoryMock.DEFAULT.rootdir;

  const factory: t.FsDriverFactory = async (dir?: string) => {
    const mock = MemoryMock.create(Path.join(root, Path.trim(dir)));
    return mock.driver;
  };

  const ctx: t.SpecContext = { describe, it, factory, root };
  Spec.every(ctx);
});
