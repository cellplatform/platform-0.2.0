import { DEFAULT, Path, t } from './common.mjs';

/**
 * Helpers for working with file-caching a directory.
 */
export function ManifestCache(args: { fs: t.FsDriverLocal; dir: string; filename?: string }) {
  const { fs, dir } = args;
  const filename = Path.trim(args.filename ?? DEFAULT.CACHE_FILENAME);
  const path = Path.join(dir, filename).substring(fs.dir.length);
  const uri = `path:${path}`;

  const api = {
    dir,
    path,

    async dirExists() {
      const uri = `path:${dir.substring(fs.dir.length)}`;
      return (await fs.info(uri)).exists;
    },

    async read() {
      const file = (await fs.read(uri)).file?.data;
      if (!file) return undefined;
      try {
        const text = new TextDecoder().decode(file);
        const manifest = JSON.parse(text) as t.DirManifest;
        return manifest.kind === 'dir' && typeof manifest.dir === 'object' ? manifest : undefined;
      } catch (error: any) {
        return undefined;
      }
    },

    async write(manifest: t.DirManifest) {
      const json = JSON.stringify(manifest, null, '  ');
      const data = new TextEncoder().encode(json);
      await fs.write(uri, data);
    },

    async delete() {
      await fs.delete(uri);
    },
  };

  return api;
}
