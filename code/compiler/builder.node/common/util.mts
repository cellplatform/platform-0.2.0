import type * as t from '../types.mjs';
import { fs } from './fs.mjs';

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
};
