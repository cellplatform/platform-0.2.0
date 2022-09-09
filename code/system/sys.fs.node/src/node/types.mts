import type fsextra from 'fs-extra';
import type path from 'path';

/**
 * Common Node (POSIX) based filesystem interface.
 */
export type NodeFs = typeof fsextra & typeof path & { glob: NodeGlobMatcher };

/**
 * Filesystem path pattern searcher (glob, minimatch).
 *
 *    - https://www.npmjs.com/package/glob
 *    - https://www.npmjs.com/package/minimatch
 *
 */
export type NodeGlob = { find: NodeGlobMatcher };
export type NodeGlobOptions = {
  nodir?: boolean;
  ignore?: string | ReadonlyArray<string>;
  nocase?: boolean;
  dot?: boolean;
};
export type NodeGlobMatcher = (pattern: string, options?: NodeGlobOptions) => Promise<string[]>;
