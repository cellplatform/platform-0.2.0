import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/_archive/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samples/**',
  '**/dist/**',
];
const dir = fs.currentDir(import.meta.url);
const pattern = fs.join(dir, 'code/**/*.{ts,tsx,mts}'); // Adjust the pattern as needed
const files = await fs.glob(pattern, { exclude });

console.log();
console.log('pattern:  ', c.green(pattern));
console.log('files:    ', c.yellow(files.length.toLocaleString()));
