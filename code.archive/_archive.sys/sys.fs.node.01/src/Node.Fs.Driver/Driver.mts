import { Path, t } from '../common';
import { FsIndexer } from './Driver.Indexer.mjs';
import { FsIO } from './Driver.IO.mjs';

type DirPath = string;

/**
 * A filesystem I/O driver running against the node-js 'fs' interface.
 */
export function NodeDriver(args: { dir: DirPath }): t.FsDriver {
  const dir = Path.ensureSlashes(args.dir);
  const io = FsIO({ dir });
  const indexer = FsIndexer({ dir });
  return { io, indexer };
}
