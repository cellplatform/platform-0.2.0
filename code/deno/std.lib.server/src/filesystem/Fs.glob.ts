import { expandGlob, type WalkEntry } from '@std/fs';
import { Path } from './Path.ts';

/**
 * Run a glob pattern against the file-system.
 */
export function glob(...dir: (string | undefined)[]) {
  const asStrings = (dir: (string | undefined)[]) => dir.filter(Boolean) as string[];
  return {
    async find(pattern: string, options: { exclude?: string[] } = {}): Promise<WalkEntry[]> {
      const { exclude } = options;
      const res: WalkEntry[] = [];
      for await (const file of expandGlob(Path.join(...asStrings(dir), pattern), { exclude })) {
        res.push(file);
      }
      return res;
    },
    dir(...subdir: (string | undefined)[]) {
      return glob(Path.join(...asStrings(dir), ...asStrings(subdir)));
    },
  } as const;
}
