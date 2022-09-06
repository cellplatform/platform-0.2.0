import { t, Time, ManifestHash, Path, Delete, ManifestFiles } from '../common/index.mjs';
import { DbLookup } from '../IndexedDb/index.mjs';

export function FsIndexer(args: { dir: string; db: IDBDatabase; fs: t.FsDriverIO }) {
  const { dir, db, fs } = args;
  const baseDir = dir;
  const lookup = DbLookup(db);

  const api: t.FsIndexer = {
    dir,

    /**
     * Generate a directory listing manifest.
     */
    async manifest(options = {}) {
      const formatPath = (path: string) => Path.trimSlashesStart(path);

      /**
       * Wrangle the directory to index.
       */
      const dir: string = await (async () => {
        let dir = (options.dir || '').trim();
        if (!dir) return baseDir; // No explicit directory specified, use root.

        dir = `/${Path.trimSlashes(dir)}`;
        if ((await fs.info(`path:${dir}`)).kind === 'file') dir = Path.parts(dir).dir;
        if (dir !== '/') dir = `${dir}/`;
        return dir;
      })();

      const filter = (record: t.PathRecord) => {
        const path = formatPath(record.path);
        if (options.filter) {
          const is = { dir: false, file: true };
          if (!options.filter({ path, is })) return false;
        }
        return record.path.startsWith(dir);
      };

      const toFile = (record: t.PathRecord): t.ManifestFile => {
        return Delete.undefined({
          path: formatPath(record.path),
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
