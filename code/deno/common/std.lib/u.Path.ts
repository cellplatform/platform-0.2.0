import { ensureDir, exists } from 'jsr:@std/fs@1.0.3';
import { basename, dirname, fromFileUrl, join, resolve, toFileUrl } from 'jsr:@std/path@1.0.4';

/**
 * Path helpers.
 */
export const Path = {
  exists,
  join,
  fromFileUrl,
  toFileUrl,
  resolve,
  ensureDir,
  dirname,
  basename,
} as const;
