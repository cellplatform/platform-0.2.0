import { exists } from 'jsr:@std/fs@1.0.3';
import { copyDir, glob } from './u.Fs.u.ts';
import { Path } from './u.Path.ts';

export { Path };

/**
 * Filesystem helpers.
 */
export const Fs = {
  ...Path,
  exists,
  Path,
  glob,
  copyDir,
  remove: Deno.remove,
} as const;
