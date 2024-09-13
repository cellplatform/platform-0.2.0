import { Fs, c } from '../code/deno/std.lib/src/mod.ts';

const exclude = [
  '**/node_modules/**',
  '**/compiler/**',
  '**/compiler.samples/**',
  '**/*.d.mts',
  // '**/spikes/**',
];

const pattern = 'code/**/*.mts';
const dir = Fs.resolve(import.meta.dirname || '', '..');
const paths = await Fs.glob(dir).find(pattern, { exclude });

for (const file of paths) {
  const path = file.path.substring(dir.length + 1);

  const from = file.path;
  const to = Fs.join(Fs.dirname(file.path), file.name.replace(/\.mts$/, '.ts'));

  console.log(c.yellow('-------------------------------------------'));
  console.log(c.green('•'), path);
  console.log('  from', c.gray(from));
  console.log('  to  ', c.green(to));

  // await Deno.rename(from, to);
}

console.log(c.green('-'));
console.log(`↑ dir: ${c.green(dir)}`);

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('total'), paths.length);
