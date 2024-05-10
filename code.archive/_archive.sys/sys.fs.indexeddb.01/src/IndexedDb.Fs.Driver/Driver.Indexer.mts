import { Delete, ManifestFiles, ManifestHash, Path, t, Time } from '../common';
import { DbLookup } from '../IndexedDb';

type DirPath = string;

/**
 * Provides indexing services over the filesystem (manifest generation).
 */
export function FsIndexer(args: { dir: DirPath; db: IDBDatabase }) {
  const { db } = args;
  const root = Path.ensureSlashes(args.dir);
  const lookup = DbLookup(db);

  const driver: t.FsIndexer = {
    dir: root,

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
        const matchDir = Path.ensureSlashes(Path.join(root, dir));

        return recordDir.startsWith(matchDir);
      };

      const toFile = (record: t.PathRecord): t.ManifestFile => {
        return Delete.undefined({
          path: toManifestFilePath(record.path),
          bytes: record.bytes,
          filehash: record.hash,
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

  return driver;
}
