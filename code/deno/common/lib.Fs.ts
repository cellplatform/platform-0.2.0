import { exists } from 'jsr:@std/fs@1.0.3';
import { Path } from './lib.Fs.Path.ts';
import { copyDir, glob } from './lib.Fs.u.ts';

export { Path };

export const Fs = {
  ...Path,
  exists,
  Path,
  glob,
  copyDir,
  remove: Deno.remove,
} as const;
