import { pc, fs, glob, filesize, Sort } from './libs.mjs';

type Package = { name: string; dependencies?: PackageDeps; devDependencies?: PackageDeps };
type PackageDeps = { [key: string]: string };

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
  glob(pattern: string) {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)));
    });
  },

  /**
   * Convert a number (bytes) to a human readable file-size string.
   */
  filesize(bytes: number) {
    return filesize(bytes);
  },

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

  /**
   * Find all project dirs within the project.
   */
  async findProjectDirs(
    options: {
      filter?: (path: string) => boolean;
      sort?: 'DependencyGraph' | 'Alpha' | 'None';
    } = {},
  ) {
    const pkg = await Util.loadPackageJson();

    const findPattern = (pattern: string) => fs.glob.find(fs.resolve(fs.join('.', pattern)));
    const paths = (await Promise.all(pkg.workspaces.packages.map(findPattern))).flat();

    const dirs = await Util.asyncFilter(paths, async (path) => {
      if (path.includes('/template')) return false;
      if (!(await fs.pathExists(fs.join(path, 'package.json')))) return false;
      return options.filter ? options.filter(path) : true;
    });

    const { sort = 'Alpha' } = options;
    if (sort === 'Alpha') return Util.sortAlpha(dirs);
    if (sort === 'DependencyGraph') return Util.sortProjectDirsDepthFirst(dirs);

    return dirs;
  },

  /**
   * Sort project dirs (topological sort on dependency graph)
   */
  async sortProjectDirsDepthFirst(dirs: string[], options: { algorithm?: 'DFS' | 'BFS' } = {}) {
    const { algorithm = 'DFS' } = options;

    const graph = new Map<string, string[]>();
    await Promise.all(
      dirs.map(async (dir) => {
        const pkg = (await fs.readJson(fs.join(dir, 'package.json'))) as Package;
        const deps = Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
        graph.set(pkg.name, deps);
      }),
    );

    const order = (() => {
      if (algorithm === 'DFS') return Sort.Topological.dfs(graph);
      if (algorithm === 'BFS') return Sort.Topological.bfs(graph);
      throw new Error(`Sort algorithm kind '${algorithm}' not supported.`);
    })();

    return order
      .map((name) => dirs.find((path) => path.endsWith(`/${name}`)) ?? '')
      .filter(Boolean)
      .reverse();
  },

  /**
   * Sort alphabetically ("natural" compare)
   */
  async sortAlpha(dirs: string[]) {
    return [...dirs].sort(Sort.String.naturalCompare);
  },
};
