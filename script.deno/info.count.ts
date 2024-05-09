import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/_archive/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samples/**',
  '**/dist/**',
];
const pattern = 'code/**/*.{ts,tsx,mts}';
const files = await fs.glob(import.meta.dirname, '..').find(pattern, { exclude });

console.log();
console.log('pattern:  ', c.green(pattern));
console.log('files:    ', c.yellow(files.length.toLocaleString()));
