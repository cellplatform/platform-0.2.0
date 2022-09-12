import type * as t from '../types.mjs';
import { fs } from './fs.mjs';

export const Util = {
  async loadJsonFile<T>(file: t.PathString) {
    return (await fs.readJson(fs.resolve(file))) as T;
  },

  async loadPackageJsonFile(file: t.PathString) {
    file = (file || '').trim();
    if (!file.endsWith('/package.json')) file = `${file}/package.json`;
    return await Util.loadJsonFile<t.PackageJson>(file);
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
