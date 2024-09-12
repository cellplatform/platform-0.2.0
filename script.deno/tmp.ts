import { Fs, c } from './u.ts';

const exclude = [
  '**/node_modules/**',
  // '**/spikes/**',
  '**/compiler/**',
  '**/compiler.samples/**',
  '**/*.d.mts',
];

const pattern = 'code/**/entry.Specs.mts';
const dir = Fs.resolve(import.meta.dirname || '', '..');
const paths = await Fs.glob(dir).find(pattern, { exclude });

for (const file of paths) {
  const path = file.path.substring(dir.length + 1);
  console.log(c.green('•'), path);

  const from = file.path;
  const to = Fs.join(Fs.dirname(file.path), file.name.replace(/\.mts$/, '.ts'));

  console.log('-------------------------------------------');
  console.log('from', from);
  console.log('to  ', to);

  // await Deno.rename(from, to);
}

console.log(c.green('-'));
console.log(`↑ dir: ${c.green(dir)}`);

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('total'), paths.length);
