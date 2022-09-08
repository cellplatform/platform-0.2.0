import { Delete, ManifestFiles, ManifestHash, Path, t, Time } from '../common/index.mjs';

type DirPathString = string;

/**
 * Provides indexing services over the filesystem (manifest generation).
 */
export function FsIndexer(args: { dir: DirPathString }) {
  const root = Path.ensureSlashes(args.dir);

  const driver: t.FsIndexer = {
    dir: root,

    /**
     * Generate a directory listing manifest.
     */
    async manifest(options = {}) {
      throw new Error('Not implemented - manfiest'); // TEMP 🐷
    },
  };

  return driver;
}
