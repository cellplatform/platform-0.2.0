import type * as t from '../types.mjs';
import { fs } from './fs.mjs';
import { Paths } from '../Paths.mjs';
import { TopologicalSort } from './util.TopologicalSort.mjs';

/**
 * Package JSON.
 */
export const PackageJson = {
  async load(dir: t.PathString) {
    return Util.loadJson<t.PackageJson>(PackageJson.path(dir));
  },

  async save(dir: t.PathString, pkg: t.PackageJson) {
    await fs.writeFile(PackageJson.path(dir), Util.stringify(pkg));
  },

  path(dir: t.PathString) {
    dir = (dir || '').trim();
    if (!dir.endsWith('/package.json')) dir = `${dir}/package.json`;
    return dir;
  },
};

/**
 * Common helpers.
 */
export const Util = {
  PackageJson,

  async loadJson<T>(file: t.PathString) {
    return (await fs.readJson(fs.resolve(file))) as T;
  },

  stringify(input: any) {
    return `${JSON.stringify(input, null, '  ')}\n`;
  },

  stripRelativeRoot(input: t.PathString) {
    return (input || '').replace(/^\.\//, '');
  },

  ensureRelativeRoot(input: t.PathString) {
    return `./${Util.stripRelativeRoot(input)}`;
  },

  objectHasKeys(input: any) {
    if (typeof input !== 'object') return false;
    return Object.keys(input).length > 0;
  },

  trimVersionAdornments(version: string) {
    return (version || '').trim().replace(/^\^/, '').replace(/^\~/, '');
  },

  async asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
    const results = await Promise.all(list.map(predicate));
    return list.filter((_, index) => results[index]);
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
    const pkg = await Util.PackageJson.load(Paths.rootDir);

    const findPattern = (pattern: string) => fs.glob.find(fs.resolve(fs.join('.', pattern)));
    const workspaces = pkg.workspaces ?? { packages: [] };
    const paths = (await Promise.all(workspaces.packages.map(findPattern))).flat();

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
        const pkg = (await fs.readJson(fs.join(dir, 'package.json'))) as t.PackageJson;
        const deps = Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
        graph.set(pkg.name, deps);
      }),
    );

    const order = (() => {
      if (algorithm === 'DFS') return TopologicalSort.dfs(graph);
      if (algorithm === 'BFS') return TopologicalSort.bfs(graph);
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
    return [...dirs].sort();
  },
};
