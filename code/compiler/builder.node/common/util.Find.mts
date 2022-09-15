import { Paths } from '../Paths.mjs';
import { fs } from './fs.mjs';
import { PackageJsonUtil } from './util.Json.mjs';
import { TopologicalSort } from './util.TopologicalSort.mjs';

import type * as t from '../types.mjs';

/**
 * Find helpers for looking up directory paths and other
 * queries on the project structure.
 */
export const FindUtil = {
  /**
   * Find all project dirs within the project.
   */
  async projectDirs(
    options: {
      filter?: t.PathFilter;
      sort?: 'Topological' | 'Alpha' | 'None';
    } = {},
  ) {
    const pkg = await PackageJsonUtil.load(Paths.rootDir);

    const findPattern = (pattern: string) => fs.glob.find(fs.resolve(fs.join('.', pattern)));
    const workspaces = pkg.workspaces ?? { packages: [] };
    const paths = (await Promise.all(workspaces.packages.map(findPattern))).flat();

    const dirs = await asyncFilter(paths, async (path) => {
      if (path.includes('/code/compiler')) return false;
      if (!(await fs.pathExists(fs.join(path, 'package.json')))) return false;
      path = path.substring(Paths.rootDir.length);
      return options.filter ? options.filter(path) : true;
    });

    const { sort = 'Alpha' } = options;
    if (sort === 'Alpha') return FindUtil.sortAlpha(dirs);
    if (sort === 'Topological') return FindUtil.sortProjectDirsDepthFirst(dirs);

    return dirs;
  },

  /**
   * Sort alphabetically ("natural" compare)
   */
  async sortAlpha(dirs: string[]) {
    return [...dirs].sort();
  },

  /**
   * Sort project dirs (topological sort on dependency graph)
   */
  async sortProjectDirsDepthFirst(dirs: string[], options: { algorithm?: 'DFS' | 'BFS' } = {}) {
    const { algorithm = 'DFS' } = options;

    const graph = new Map<string, string[]>();
    await Promise.all(
      dirs.map(async (dir) => {
        const pkg = (await fs.readJson(fs.join(dir, 'package.json'))) as t.PkgJson;
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
};

/**
 * Helpers
 */

async function asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
  const results = await Promise.all(list.map(predicate));
  return list.filter((_, index) => results[index]);
}
