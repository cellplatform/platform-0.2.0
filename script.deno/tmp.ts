import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samnples/**',
  '**/*.d.mts',
];

const dir = fs.resolve(import.meta.dirname || '', '..');
const pattern = 'code/**/*.mts';
const paths = await fs.glob(dir).find(pattern, { exclude });

paths.forEach((file) => {
  const path = file.path.substring(dir.length + 1);
  console.log(c.green('•'), path);
});
console.log(`↑ dir: ${c.green(dir)}`);

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('total'), paths.length);
