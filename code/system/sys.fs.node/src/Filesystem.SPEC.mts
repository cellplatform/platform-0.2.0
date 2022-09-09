import { Spec } from 'sys.fs.spec';

import { FsNodeDriver, NodeFs } from './index.mjs';
import { expect, describe, it, MemoryMock, t, Path } from './TEST/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('FsDriver (Node) - functional specification', () => {
  const root = NodeFs.resolve('./tmp');
  const toLocation = (path: string) => Path.toAbsoluteLocation(path, { root });

  const factory: t.FsDriverFactory = async (dir) => {
    await NodeFs.remove(root); // NB: reset test state.
    dir = Path.join(root, Path.trim(dir));
    return FsNodeDriver({ dir });
  };

  // Spec.every({ root, factory, describe, it });

  const ctx = { root, factory, describe, it };
  Spec.Driver.IO.InfoSpec(ctx);
  Spec.Driver.IO.ReadWriteSpec(ctx);
  Spec.Driver.IO.DeleteSpec(ctx);
  Spec.Driver.IO.CopySpec(ctx);
  Spec.Driver.Indexer.DirSpec(ctx);

  // TEMP 🐷
  it('TMP', async () => {
    //
  });
});
