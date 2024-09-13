import { ensureDir, exists } from '@std/fs';
import { basename, dirname, fromFileUrl, join, resolve, toFileUrl } from '@std/path';

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
