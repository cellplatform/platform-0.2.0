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
const pattern = 'code/**/*.{ts,tsx,mts}';
const files = await fs.glob(dir).find(pattern, { exclude });

console.log();
console.log('pattern:  ', c.green(pattern));
console.log('files:    ', c.yellow(files.length.toLocaleString()));
