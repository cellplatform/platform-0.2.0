import { Spec } from 'sys.fs.spec';

import { NodeDriver, NodeFs } from './index.mjs';
import { describe, it, Path, t } from './test/index.mjs';

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('Filesystem: NodeDriver (functional specification)', () => {
  const root = NodeFs.resolve('tmp/spec');

  const factory: t.FsDriverFactory = async (dir) => {
    await NodeFs.remove(root); // NB: reset test state.
    dir = Path.join(root, Path.trim(dir));
    return NodeDriver({ dir });
  };

  Spec.every({ root, factory, describe, it });
});
