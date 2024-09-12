import { expandGlob, type WalkEntry } from 'jsr:@std/fs@1.0.3';
import { Path } from './u.Path.ts';

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

/**
 * Copy all files in a directory.
 */
export async function copyDir(sourceDir: string, targetDir: string) {
  await Deno.mkdir(targetDir, { recursive: true });
  for await (const entry of Deno.readDir(sourceDir)) {
    const srcPath = `${sourceDir}/${entry.name}`;
    const destPath = `${targetDir}/${entry.name}`;
    if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}
