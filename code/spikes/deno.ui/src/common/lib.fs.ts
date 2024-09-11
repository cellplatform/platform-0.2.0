import { ensureDir, exists } from 'jsr:@std/fs@1.0.3';
import { dirname, join, resolve } from 'jsr:@std/path@1.0.4';

async function copyDir(sourceDir: string, targetDir: string) {
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

/**
 * Filesystem Path helpers.
 */
export const Path = { join, dirname, resolve, exists } as const;

/**
 * Filesystem helpers.
 */
export const Fs = { Path, exists, ensureDir, copyDir } as const;
