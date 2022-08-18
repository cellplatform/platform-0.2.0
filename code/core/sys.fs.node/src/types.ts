import { fsextra, path } from './common';

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
export type NodeGlobMatcher = (pattern: string) => Promise<string[]>;
