import type { WalkEntry } from 'https://deno.land/std@0.224.0/fs/walk.ts';

import { expandGlob, ensureDir } from 'https://deno.land/std@0.224.0/fs/mod.ts';
import { dirname, fromFileUrl, join, resolve } from 'https://deno.land/std@0.224.0/path/mod.ts';

/**
 * Run a glob pattern against the file-system.
 */
function glob(...dir: (string | undefined)[]) {
  const asStrings = (dir: (string | undefined)[]) => dir.filter(Boolean) as string[];
  return {
    async find(pattern: string, options: { exclude?: string[] } = {}): Promise<WalkEntry[]> {
      const { exclude } = options;
      const res: WalkEntry[] = [];
      for await (const file of expandGlob(join(...asStrings(dir), pattern), { exclude })) {
        res.push(file);
      }
      return res;
    },
    dir(...subdir: (string | undefined)[]) {
      return glob(join(...asStrings(dir), ...asStrings(subdir)));
    },
  } as const;
}

/**
 * Export
 */
export const path = { join, dirname, fromFileUrl, resolve, ensureDir } as const;
export const fs = {
  ...path,
  path,
  glob,
  remove: Deno.remove,
} as const;
