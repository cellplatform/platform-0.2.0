import type fsextra from 'fs-extra';
import type { GlobOptions as NodeGlobOptions } from 'glob';
import type path from 'path';
import type { Json } from 'sys.types/src/types';

/**
 * Common Node (POSIX) based filesystem interface.
 */
export type NodeFs = typeof fsextra & typeof path & { glob: NodeGlobMatcher; stream: NodeStream };

/**
 * Filesystem path pattern searcher (glob, minimatch).
 *
 *    - https://www.npmjs.com/package/glob
 *    - https://www.npmjs.com/package/minimatch
 *
 */
export type NodeGlob = { find: NodeGlobMatcher };
export type NodeGlobMatcher = (pattern: string, options?: NodeGlobOptions) => Promise<string[]>;

/**
 * Tools for working with filesystem streams on Node.
 */
export type NodeStream = {
  isReadableStream(input?: any): boolean;
  encode(input?: string): Uint8Array;
  decode(input?: BufferSource, options?: TextDecodeOptions): string;
  toUint8Array(input?: ReadableStream | Json | Uint8Array): Promise<Uint8Array>;
  save(path: string, data: ReadableStream | Json): Promise<void>;
};
