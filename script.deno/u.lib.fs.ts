import type { WalkEntry } from 'https://deno.land/std@0.224.0/fs/walk.ts';

import { expandGlob } from 'https://deno.land/std@0.224.0/fs/mod.ts';
import { dirname, fromFileUrl, join, resolve } from 'https://deno.land/std@0.224.0/path/mod.ts';

/**
 * Retrieve the path to the current directory
 */
function currentDir(importUrl: string) {
  return fs.resolve(fs.dirname(fs.fromFileUrl(importUrl)), '..');
}

/**
 * Run a glob pattern against the file-system.
 */
async function glob(pattern: string, options: { exclude?: string[] } = {}): Promise<WalkEntry[]> {
  const { exclude } = options;
  const res: WalkEntry[] = [];
  for await (const file of expandGlob(pattern, { exclude })) {
    res.push(file);
  }
  return res;
}

/**
 * Export
 */
export const path = { join, dirname, fromFileUrl, currentDir, resolve } as const;
export const fs = { ...path, path, glob } as const;
