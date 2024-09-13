import { basename, dirname, fromFileUrl, join, resolve, toFileUrl } from '@std/path';

/**
 * Path helpers.
 */
export const Path = {
  join,
  fromFileUrl,
  toFileUrl,
  resolve,
  dirname,
  basename,
} as const;
