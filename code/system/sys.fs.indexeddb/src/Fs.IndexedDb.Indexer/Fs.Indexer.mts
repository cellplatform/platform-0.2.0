import { Delete, ManifestFiles, ManifestHash, Path, t, Time } from '../common/index.mjs';
import { DbLookup } from '../IndexedDb/index.mjs';

type DirPathString = string

/**
 * Provides indexing (manifest generation) services.
 */
export function FsIndexer(args: { dir: DirPathString; db: IDBDatabase }) {
  const { db } = args;
  const rootDir = Path.ensureSlashes(args.dir);
  const lookup = DbLookup(db);

  const api: t.FsIndexer = {
    dir: rootDir,

    /**
     * Generate a directory listing manifest.
     */
    async manifest(options = {}) {
      const toManifestFilePath = (path: string) => Path.trimSlashesStart(path);

      const filter = (record: t.PathRecord) => {
        const path = toManifestFilePath(record.path);
        if (options.filter) {
          const is = { dir: false, file: true };
          if (!options.filter({ path, is })) return false;
        }
        const dir = Path.trim(options.dir);
        const recordDir = Path.ensureSlashes(record.dir);
        const matchDir = Path.ensureSlashes(Path.join(rootDir, dir));

        return recordDir.startsWith(matchDir);
      };

      const toFile = (record: t.PathRecord): t.ManifestFile => {
        return Delete.undefined({
          path: toManifestFilePath(record.path),
          bytes: record.bytes,
          filehash: record.hash,
          image: record.image,
        });
      };

      const paths = (await lookup.paths()).filter(filter);
      const files = ManifestFiles.sort(paths.map(toFile));

      const info: t.DirManifestInfo = { indexedAt: Time.now.timestamp };
      const hash = ManifestHash.dir(info, files);
      const manifest: t.DirManifest = { kind: 'dir', dir: info, hash, files };
      return manifest;
    },
  };

  return api;
}
