import { describe, it } from 'vitest';

import { t, MemoryMock } from './common.mjs';
import { FsDriverSpec } from './Driver.spec.mjs';

describe('Filesystem Driver', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => {
    const io = MemoryMock.IO({ dir }).io;
    const indexer = MemoryMock.Indexer({ dir }).indexer;
    return { io, indexer };
  };

  FsDriverSpec.every({ describe, it, factory });
});
