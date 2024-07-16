import { Paths } from '../Paths';
import { fs } from './fs';
import { PackageJson } from './u.Json';
import { TopologicalSort } from './u.TopologicalSort';

import type * as t from '../t';

/**
 * Find helpers for looking up directory paths and other
 * queries on the project structure.
 */
export const Find = {
  /**
   * Find all project dirs within the project.
   */
  async projectDirs(
    options: {
      filter?: t.PathFilter;
      sortBy?: t.SortModulesBy;
      hasViteConfig?: boolean;
    } = {},
  ) {
    const { hasViteConfig } = options;
    const pkg = await PackageJson.load(Paths.rootDir);

    const findPattern = async (pattern: string) => fs.glob(fs.join(Paths.rootDir, pattern));
    const workspaces = pkg.workspaces ?? { packages: [] };
    const paths = (await Promise.all(workspaces.packages.map(findPattern))).flat();

    let dirs = await asyncFilter(paths, async (path) => {
      if (path.includes('/code/compiler/')) return false;
      if (!(await fs.pathExists(fs.join(path, 'package.json')))) return false;
      if (hasViteConfig && !(await fs.pathExists(fs.join(path, 'vite.config.ts')))) return false;
      return options.filter ? options.filter(path.substring(Paths.rootDir.length)) : true;
    });

    const { sortBy = 'Alpha' } = options;
    if (sortBy === 'Alpha') dirs = await Find.sortAlpha(dirs);
    if (sortBy === 'Topological') dirs = await Find.sortTopological(dirs);

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
  async sortTopological(dirs: string[], options: { algorithm?: 'DFS' | 'BFS' } = {}) {
    const { algorithm = 'DFS' } = options;

    const graph = new Map<string, string[]>();
    const pkgDirs: { dir: string; pkg: t.PkgJson }[] = [];
    await Promise.all(
      dirs.map(async (dir) => {
        const pkg = (await fs.readJson(fs.join(dir, 'package.json'))) as t.PkgJson;
        const deps = Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
        graph.set(pkg.name, deps);
        pkgDirs.push({ dir, pkg });
      }),
    );

    let order = (() => {
      if (algorithm === 'DFS') return TopologicalSort.dfs(graph);
      if (algorithm === 'BFS') return TopologicalSort.bfs(graph);
      throw new Error(`Sort algorithm kind '${algorithm}' not supported.`);
    })();

    return order
      .map((name) => pkgDirs.find(({ pkg }) => pkg.name === name))
      .map((item) => (item ? item.dir : ''))
      .filter(Boolean)
      .reverse();
  },
} as const;

/**
 * Helpers
 */

async function asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
  const results = await Promise.all(list.map(predicate));
  return list.filter((_, index) => results[index]);
}
