import { fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samnples/**',
  '**/*.d.mts',
];

const pattern = 'code/**/src/index.mts';
const dir = fs.resolve(import.meta.dirname || '', '..');
const paths = await fs.glob(dir).find(pattern, { exclude });

for (const file of paths) {
  const path = file.path.substring(dir.length + 1);
  console.log(c.green('•'), path);

  const from = file.path;
  const to = fs.join(fs.dirname(from), 'index.ts');
  console.log('-------------------------------------------');
  console.log('from', from);
  console.log('to  ', to);
  // console.log('file', file);
  await Deno.rename(from, to);
}

console.log(`↑ dir: ${c.green(dir)}`);

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('total'), paths.length);
