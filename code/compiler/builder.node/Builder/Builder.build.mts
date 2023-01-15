import { fs, t, pc, Util, LogTable } from '../common';
import { Dependencies } from '../op/Dependencies.mjs';
import { Package } from '../op/Package.mjs';
import { Typescript } from '../op/Typescript.mjs';
import { Vite } from '../op/Vite.mjs';
import { Paths } from '../Paths.mjs';
import { Template } from '../Template.mjs';

/**
 * Run a build that:
 *
 *    - Builds type definitions [.d.ts] output into a root /types folder.
 *    - Bundles typescript into production distribution (ESM, via Vite/Rollup)
 *    - Updates [packag.json] with ESM {exports} and typescript {typesVersions}.
 *
 */
export async function build(
  dir: t.DirString,
  options: { silent?: boolean; exitOnError?: boolean; syncDeps?: boolean } = {},
) {
  const { silent = false, exitOnError = true, syncDeps = false } = options;
  dir = fs.resolve(dir);
  const relativeDir = dir.substring(Paths.rootDir.length);

  // Pre-build.
  await Template.ensureBaseline(dir);
  if (syncDeps) {
    await Dependencies.syncVersions({ filter: (dir) => dir === relativeDir });
  }

  // - Typescript.
  const tsBuildOutput = await Typescript.build(dir, { exitOnError, silent });
  if (!tsBuildOutput.ok) return tsBuildOutput;

  // - ESM bundling.
  const viteBuildOutput = await Vite.build(dir, { silent });
  if (!viteBuildOutput.ok) return viteBuildOutput;

  // Post build.
  await fs.remove(fs.join(dir, Paths.types.dist));
  await fs.move(fs.join(dir, Paths.types.dirname), fs.join(dir, Paths.types.dist));
  await Package.generate(dir);
  await Vite.deleteBuildManifests(dir);

  // Finish up.
  if (!silent) {
    const typedir = `/${Paths.types.dirname}/`;
    const size = await Util.folderSize(fs.join(dir, 'dist'));

    const bundle = size.filter(({ path }) => !path.includes(typedir));
    const types = size.filter(({ path }) => path.includes(typedir));

    const bundleSize = pc.bold(pc.white(bundle.toString()));
    const typesSize = types.toString();

    const prefix = pc.bgCyan(pc.bold(' dist '));
    const filesize = pc.bold(pc.white(size.toString()));

    const table = LogTable();
    table.push([' '.repeat(6), 'bundle', `  ${bundle.length} files  `, bundleSize]);
    table.push([' '.repeat(6), 'types.d', `  ${types.length} files  `, typesSize]);

    console.info(``);
    console.info(pc.gray(`${prefix} ${filesize}`));
    console.info(pc.gray(table.toString()));
    console.info('');
  }

  return { ok: true, errorCode: 0 };
}
