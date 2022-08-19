/// <reference types="node" />
import { fsextra, path } from './common/index.mjs';
/**
 * Common Node (POSIX) based filesystem interface.
 */
export declare type NodeFs = typeof fsextra & typeof path & {
    glob: NodeGlobMatcher;
};
/**
 * Filesystem path pattern searcher (glob, minimatch).
 *
 *    - https://www.npmjs.com/package/glob
 *    - https://www.npmjs.com/package/minimatch
 *
 */
export declare type NodeGlob = {
    find: NodeGlobMatcher;
};
export declare type NodeGlobMatcher = (pattern: string) => Promise<string[]>;
