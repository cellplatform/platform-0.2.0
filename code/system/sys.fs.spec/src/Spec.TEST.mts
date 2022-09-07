import { describe, it } from 'vitest';

import { MemoryMock, t } from './common/index.mjs';
import { Spec } from './Spec.mjs';

describe('Filesystem (Spec)', () => {
  const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir).driver;
  const ctx: t.SpecContext = { describe, it, factory };

  Spec.every(ctx);

  // NB: Repeating tests - each `.every(ctx)` at a higher
  // level rolls up the lower level `.every(ctx)` methods.
  Spec.Driver.every(ctx);
  Spec.Driver.IO.every(ctx);
  Spec.Driver.Indexer.every(ctx);
});
