import { Fs, c } from './u.ts';

async function count() {
  const exclude = [
    '**/node_modules/**',
    '**/_archive/**',
    '**/spikes/**',
    '**/compiler/**',
    '**/compiler.samples/**',
    '**/dist/**',
  ];
  const pattern = 'code/**/*.{ts,tsx,mts}';
  const files = await Fs.glob(import.meta.dirname, '..').find(pattern, { exclude });

  console.info('pattern:  ', c.green(pattern));
  console.info('files:    ', c.yellow(files.length.toLocaleString()));
}

/**
 * System/Repo info.
 */
console.info('↓ 👋');
await count();
console.info();
