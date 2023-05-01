import { pc, fs, glob, filesize } from './libs.mjs';

export const Util = {
  async loadPackageJson() {
    type P = { workspaces: { packages: string[] } };
    return (await fs.readJson(fs.resolve('./package.json'))) as P;
  },

  async asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
    const results = await Promise.all(list.map(predicate));
    return list.filter((_, index) => results[index]);
  },

  formatPath(path: string, options: { filenameColor?: (value?: string | number) => string } = {}) {
    const filenameColor = options.filenameColor ?? pc.white;
    const base = fs.resolve('.');
    const relative = path.substring(base.length + 1);
    const dirname = fs.basename(relative);
    const prefix = relative.substring(0, relative.length - dirname.length);
    return pc.gray(`${prefix}${filenameColor(dirname)}`);
  },

  /**
   * Find matching files.
   */
  glob,

  /**
   * Convert a number (bytes) to a human readable file-size string.
   */
  filesize,

  /**
   * Calculate the size of a folder
   */
  async folderSize(dir: string) {
    const paths = await Util.glob(fs.join(dir, '**/*'));
    let bytes = 0;
    await Promise.all(
      paths.map(async (path) => {
        const stats = await fs.stat(path);
        bytes += stats.size;
      }),
    );
    return { dir, paths, bytes, toString: () => filesize(bytes) };
  },
};
