import { pc, fs, glob } from './libs.mjs';

export const Util = {
  async loadPackageJson() {
    type P = { workspaces: { packages: string[] } };
    return (await fs.readJson(fs.resolve('./package.json'))) as P;
  },

  async asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
    const results = await Promise.all(list.map(predicate));
    return list.filter((_, index) => results[index]);
  },

  formatPath(path: string) {
    const base = fs.resolve('.');
    const relative = path.substring(base.length + 1);
    const dirname = fs.basename(relative);
    const prefix = relative.substring(0, relative.length - dirname.length);
    return pc.gray(`${prefix}${pc.white(dirname)}`);
  },

  /**
   * Find all project dirs within the project.
   */
  async findProjectDirs(filter?: (path: string) => boolean) {
    const pkg = await Util.loadPackageJson();
    const paths = (
      await Promise.all(
        pkg.workspaces.packages.map((pattern) => fs.glob.find(fs.resolve(fs.join('.', pattern)))),
      )
    ).flat();

    return Util.asyncFilter(paths, async (path) => {
      if (path.includes('/template')) return false;
      if (!(await fs.pathExists(fs.join(path, 'package.json')))) return false;
      return filter ? filter(path) : true;
    });
  },

  /**
   * Find matching files.
   */
  glob(pattern: string) {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)));
    });
  },
};
