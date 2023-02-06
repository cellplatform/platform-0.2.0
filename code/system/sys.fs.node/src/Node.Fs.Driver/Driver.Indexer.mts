import { Hash, ManifestFiles, ManifestHash, Path, t, Time } from '../common';
import { NodeFs } from '../node';

type DirPath = string;

/**
 * Provides indexing services over the filesystem (manifest generation).
 */
export function FsIndexer(args: { dir: DirPath }) {
  const root = Path.ensureSlashes(args.dir);

  const driver: t.FsIndexer = {
    dir: root,

    /**
     * Generate a directory listing manifest.
     */
    async manifest(options = {}) {
      const formatPath = (path: string) => Path.trimSlashesStart(path.substring(root.length));

      const is = { dir: false, file: true };
      const filter = (path: string) => (options?.filter ? options?.filter({ path, is }) : true);

      const base = options.dir ? Path.join(root, Path.ensureSlashes(options.dir)) : root;
      const pattern = Path.join(base, '**/*');
      const paths = (await NodeFs.glob(pattern, { nodir: true, dot: true }))
        .map(formatPath)
        .filter(filter);

      const toFile = async (path: string): Promise<t.ManifestFile> => {
        const buffer = await NodeFs.readFile(Path.join(root, path));
        const data = new Uint8Array(buffer);
        const bytes = data.byteLength;
        const filehash = Hash.sha256(data);
        return { path, bytes, filehash };
      };

      const files = ManifestFiles.sort(await Promise.all(paths.map(toFile)));
      const info: t.DirManifestInfo = { indexedAt: Time.now.timestamp };
      const hash = ManifestHash.dir(info, files);
      const manifest: t.DirManifest = { kind: 'dir', dir: info, hash, files };
      return manifest;
    },
  };

  return driver;
}
