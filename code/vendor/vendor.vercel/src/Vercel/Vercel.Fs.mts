import { type t } from './common.mjs';

type DirPath = string;

/**
 * Filesystem helpers for working with Vercel.
 */
export const VercelFs = {
  /**
   * Read directory into a "bundle" (manifest WITH binary file data).
   */
  async readdir(fs: t.Fs, path?: DirPath) {
    if (typeof path === 'string' && !(await fs.is.dir(path))) {
      throw new Error(`Path is not a directory: "${path}"`);
    }

    const dir = fs.dir(path ?? '');
    const manifest = await dir.manifest();
    const wait = manifest.files.map(async ({ path }) => ({ path, data: await dir.read(path) }));
    const files: t.VercelFile[] = (await Promise.all(wait)).filter((file) => Boolean(file.data));
    const bundle: t.VercelSourceBundle = { files, manifest };

    return bundle;
  },

  /**
   * Attempt to load the manifest for a bundle.
   */
  wrangleManifest(args: { fs: t.Fs; source: string | t.VercelSourceBundle }) {
    const { fs, source } = args;

    if (typeof source === 'string') {
      return fs.json.read<t.Manifest>(fs.join(source, 'index.json'));
    }

    const file = source.files.find((file) => file.path === 'index.json');
    if (file?.data) {
      const text = new TextDecoder().decode(file.data);
      return JSON.parse(text) as t.Manifest;
    }

    return undefined;
  },
};
