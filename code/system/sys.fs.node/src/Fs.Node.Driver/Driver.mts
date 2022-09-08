import { t, Path } from '../common/index.mjs';
import { FsIO } from './Driver.IO.mjs';
import { FsIndexer } from './Driver.Indexer.mjs';

type DirPathString = string;

/**
 * A filesystem I/O driver running against the node-js 'fs' interface.
 */
export function FsNodeDriver(args: { dir: DirPathString }): t.FsDriver {
  const dir = Path.ensureSlashes(args.dir);
  const io = FsIO({ dir });
  const indexer = FsIndexer({ dir });
  return { io, indexer };
}
