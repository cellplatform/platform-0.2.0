import { DEFAULT, Path, t } from './common';

/**
 * Helpers for working with file-caching a directory.
 */
export function ManifestCache(args: { io: t.FsIO; dir: string; filename?: string }) {
  const { io, dir } = args;
  const filename = Path.trim(args.filename ?? DEFAULT.CACHE_FILENAME);
  const path = Path.join(dir, filename).substring(io.dir.length);
  const uri = `path:${path}`;

  const api = {
    dir,
    path,

    async dirExists() {
      const uri = `path:${dir.substring(io.dir.length) || '.'}`;
      return (await io.info(uri)).exists;
    },

    async read() {
      const file = (await io.read(uri)).file?.data;
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
      await io.write(uri, data);
    },

    async delete() {
      await io.delete(uri);
    },
  };

  return api;
}
