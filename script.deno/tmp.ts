import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samnples/**',
  '**/*.d.mts',
];

const pattern = 'code/**/*.mts';
const paths = await fs
  .glob(import.meta.dirname)
  .dir('..')
  .find(pattern, { exclude });

paths.forEach((file) => {
  console.log('>', file.path);
});

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('paths.length'), paths.length);
