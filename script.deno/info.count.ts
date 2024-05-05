import { expandGlob } from 'https://deno.land/std@0.224.0/fs/mod.ts';
import { join, dirname, fromFileUrl, resolve } from 'https://deno.land/std@0.224.0/path/mod.ts';

async function findFiles(globPattern: string): Promise<string[]> {
  const files: string[] = [];

  for await (const file of expandGlob(globPattern, {
    exclude: [
      '**/node_modules/**',
      '**/_archive/**',
      '**/spikes/**',
      '**/compiler/**',
      '**/compiler.samnples/**',
    ],
  })) {
    files.push(file.path);
  }
  return files;
}

// Get the directory of the current script
// Define your glob pattern (e.g., "*.txt" for all text files)
const currentDir = resolve(dirname(fromFileUrl(import.meta.url)), '..');

console.log('import.meta.url', import.meta.url);

export async function count() {
  // await Deno.watchFs()
  console.log('count', count);
  console.log('currentDir', currentDir);

  const globPattern = join(currentDir, 'code/**/*.{ts,tsx,mts}'); // Adjust the pattern as needed
  const res = await findFiles(globPattern);

  // console.log('res', res);
  // console.log('-------------------------------------------');

  res.forEach((path) => {
    // const relative = path.substring(currentDir.length);
    // console.log('relative', relative);
    // console.log(' > path', path);
  });

  console.log('-------------------------------------------');
  console.log('currentDir', currentDir);
  console.log('res.length', res.length);

  const m = res.filter((path) => path.includes('/_archive'));
  console.log('m', m);
}

await count();
