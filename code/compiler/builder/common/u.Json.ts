import type * as t from '../t';

import { fs } from './fs';
import { R } from './libs';
import { Version } from './u.Version';

/**
 * [package.json] file specific operations.
 */
export const PackageJson = {
  async load(dir: t.PathString) {
    return Json.load<t.PkgJson>(PackageJson.path(dir));
  },

  async save(dir: t.PathString, pkg: t.PkgJson, options: { filename?: string } = {}) {
    await fs.ensureDir(dir);
    await fs.writeFile(PackageJson.path(dir, options), Json.stringify(pkg));
  },

  path(dir: t.PathString, options: { filename?: string } = {}) {
    const { filename = 'package.json' } = options;
    dir = (dir || '').trim();
    if (!dir.endsWith(`/${filename}`)) dir = `${dir}/${filename}`;
    return dir;
  },

  deps: {
    get(pkg: t.PkgJson) {
      pkg = R.clone(pkg);
      const dependencies = pkg.dependencies ?? {};
      const devDependencies = pkg.devDependencies ?? {};
      const all = { ...devDependencies, ...dependencies };
      return {
        all,
        dependencies,
        devDependencies,
        exists: (name: string) => Boolean(all[name]),
        eq: (name: string, version: string) => Version.eq(all[name], version),
      };
    },

    set(pkg: t.PkgJson, name: string, version: string, isDev?: boolean) {
      pkg = R.clone(pkg);
      const dependencies = pkg.dependencies ?? (pkg.dependencies = {});
      const devDependencies = pkg.devDependencies ?? (pkg.devDependencies = {});
      if (!isDev) dependencies[name] = version;
      if (isDev) devDependencies[name] = version;
      return pkg;
    },

    clean(pkg: t.PkgJson) {
      pkg = R.clone(pkg);
      if (Object.keys(pkg.dependencies || {}).length === 0) delete pkg.dependencies;
      if (Object.keys(pkg.devDependencies || {}).length === 0) delete pkg.devDependencies;
      return pkg;
    },
  },
} as const;

/**
 * General JSON helpers.
 */
export const Json = {
  Pkg: PackageJson,

  async load<T>(file: t.PathString) {
    return (await fs.readJson(fs.resolve(file))) as T;
  },

  stringify(input: any) {
    return `${JSON.stringify(input, null, '  ')}\n`;
  },
} as const;
