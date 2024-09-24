import { Fs, c } from '@sys/std-s';

const exclude = [
  '**/node_modules/**',
  '**/compiler/**',
  '**/compiler.samples/**',
  '**/*.d.mts',
  // '**/spikes/**',
];

// const pattern = 'code/**/*.mts';
const pattern = 'code/**/package.json';
const dir = Fs.resolve(import.meta.dirname || '', '..');
const paths = await Fs.glob(dir).find(pattern, { exclude });

const ensureRef = async (path: string, mod: { name: string; version: string }) => {
  const json = await Deno.readTextFile(path);
  const pkg = JSON.parse(json);
  if (pkg.scripts) {
    const refExists = Object.entries(pkg.scripts).some(([, v]) => String(v).includes(mod.name));
    if (refExists) return;

    const deps = pkg.devDependencies || (pkg.devDependencies = {});
    deps[`"${mod.name}"`] = mod.version;

    await Deno.writeTextFile(path, JSON.stringify(pkg, null, '  '));
  }
  // console.log('json', json);
  console.log('pkg', pkg);
};

for (const file of paths) {
  const path = file.path.substring(dir.length + 1);

  // const from = file.path;
  // const to = Fs.join(Fs.dirname(file.path), file.name.replace(/\.mts$/, '.ts'));
  // console.log(c.yellow('-------------------------------------------'));
  // console.log(c.green('•'), path);
  // console.log('  from', c.gray(from));
  // console.log('  to  ', c.green(to));
  // await Deno.rename(from, to);

  await ensureRef(path, { name: 'vite', version: '5.4.6' });
  // await ensureRef(path, { name: 'tsx', version: '4.19.1' });
}

console.log(c.green('-'));
console.log(`↑ dir: ${c.green(dir)}`);

console.log();
console.log(`${c.yellow('.mts')} files ↑`);
console.log(c.cyan('total'), paths.length);
