import { fs, c } from './u.ts';

const currentDir = fs.currentDir(import.meta.url);
const exclude = [
  '**/node_modules/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samnples/**',
  '**/*.d.mts',
];

const pattern = fs.join(currentDir, 'code/**/*.mts');
const paths = await fs.glob(pattern, { exclude });

paths.forEach((file) => {
  console.log('> ', file.path);
});

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('paths.length'), paths.length);
