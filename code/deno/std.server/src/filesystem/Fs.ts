import { exists } from '@std/fs';
import { copyDir } from './Fs.cp.ts';
import { glob } from './Fs.glob.ts';
import { Path } from './Path.ts';

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
