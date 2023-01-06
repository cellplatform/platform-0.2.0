import { FindUtil } from './util.Find.mjs';
import { JsonUtil, PackageJsonUtil } from './util.Json.mjs';
import { VersionUtil } from './util.Version.mjs';
import { fs } from './fs.mjs';
import { prettybytes } from './libs.mjs';

import type * as t from '../types.mjs';

/**
 * Common helpers.
 */
export const Util = {
  Json: JsonUtil,
  PackageJson: PackageJsonUtil,
  Version: VersionUtil,
  Find: FindUtil,

  asArray,

  stripRelativeRoot(input: t.PathString) {
    return trim(input).replace(/^\.\//, '');
  },

  ensureRelativeRoot(input: t.PathString) {
    return `./${Util.stripRelativeRoot(input)}`;
  },

  objectHasKeys(input: any) {
    if (typeof input !== 'object') return false;
    return Object.keys(input).length > 0;
  },

  async asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
    const results = await Promise.all(list.map(predicate));
    return list.filter((_, index) => results[index]);
  },

  /**
   * Calculate the size of a folder
   */
  async folderSize(dir: string, options: { dot?: boolean } = {}) {
    type P = { path: string; bytes: number };
    const sum = (list: P[]) => list.reduce((acc, next) => acc + next.bytes, 0);

    const pathnames = await fs.glob(fs.join(dir, '**/*'), { nodir: true, dot: options.dot });
    const paths: P[] = await Promise.all(
      pathnames.map(async (path) => {
        const bytes = (await fs.stat(path)).size;
        return { path, bytes };
      }),
    );

    const api = {
      dir,
      paths,
      bytes: sum(paths),
      length: paths.length,
      filter(fn: (item: P) => boolean) {
        const paths = api.paths.filter(fn);
        const bytes = sum(paths);
        const length = paths.length;
        return { paths, bytes, length, toString: () => prettybytes(bytes) };
      },
      toString: () => prettybytes(api.bytes),
    };
    return api;
  },
};

/**
 * Helpers
 */
function trim(value?: string) {
  return (value || '').trim();
}

export function asArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}
