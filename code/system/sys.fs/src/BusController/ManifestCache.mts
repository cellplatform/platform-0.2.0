import { DEFAULT, Path, t } from './common.mjs';

/**
 * Helpers for working with file-caching a directory.
 */
export function ManifestCache(args: { driver: t.FsDriver; dir: string; filename?: string }) {
  const { driver, dir } = args;
  const filename = Path.trim(args.filename ?? DEFAULT.CACHE_FILENAME);
  const path = Path.join(dir, filename).substring(driver.dir.length);
  const uri = `path:${path}`;

  const api = {
    dir,
    path,

    async dirExists() {
      const uri = `path:${dir.substring(driver.dir.length) || '.'}`;
      return (await driver.info(uri)).exists;
    },

    async read() {
      const file = (await driver.read(uri)).file?.data;
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
      await driver.write(uri, data);
    },

    async delete() {
      await driver.delete(uri);
    },
  };

  return api;
}
