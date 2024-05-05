import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samnples/**',
  '**/*.d.mts',
];
const dir = fs.currentDir(import.meta.url);
const pattern = fs.join(dir, 'code/**/*.mts');
const paths = await fs.glob(pattern, { exclude });

paths.forEach((file) => {
  console.log('>', file.path);
});

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('paths.length'), paths.length);
