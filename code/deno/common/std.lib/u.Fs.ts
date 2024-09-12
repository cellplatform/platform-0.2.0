import { exists } from 'jsr:@std/fs@1.0.3';

import { Path } from './u.Path.ts';
import { copyDir, glob } from './u.Fs.u.ts';

export { Path };

export const Fs = {
  ...Path,
  exists,
  Path,
  glob,
  copyDir,
  remove: Deno.remove,
} as const;
