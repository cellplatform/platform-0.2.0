import { Spec } from 'sys.fs.spec';

import { FsNodeDriver, NodeFs } from './index.mjs';
import { expect, describe, it, MemoryMock, t, Path } from './TEST/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('FsDriver (Node) - functional specification', () => {
  const root = NodeFs.resolve('./tmp');

  const factory: t.FsDriverFactory = async (dir) => {
    dir = Path.join(root, Path.trim(dir));
    return FsNodeDriver({ dir });
  };

  // Spec.every({ factory, describe, it });
  Spec.Driver.IO.InfoSpec({ root, factory, describe, it });

  // TEMP 🐷
  it('TMP', async () => {});
});
