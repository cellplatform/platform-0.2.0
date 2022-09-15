import { fs } from './fs.mjs';

import type * as t from '../types.mjs';

/**
 * General JSON helpers.
 */
export const JsonUtil = {
  async load<T>(file: t.PathString) {
    return (await fs.readJson(fs.resolve(file))) as T;
  },

  stringify(input: any) {
    return `${JSON.stringify(input, null, '  ')}\n`;
  },
};

/**
 * [package.json] file specific operations.
 */
export const PackageJsonUtil = {
  async load(dir: t.PathString) {
    return JsonUtil.load<t.PackageJson>(PackageJsonUtil.path(dir));
  },

  async save(dir: t.PathString, pkg: t.PackageJson) {
    await fs.writeFile(PackageJsonUtil.path(dir), JsonUtil.stringify(pkg));
  },

  path(dir: t.PathString) {
    dir = (dir || '').trim();
    if (!dir.endsWith('/package.json')) dir = `${dir}/package.json`;
    return dir;
  },
};
