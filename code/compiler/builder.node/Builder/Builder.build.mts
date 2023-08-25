import { fs, LogTable, pc, Util, type t } from '../common/index.mjs';
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

  // - Typescript (lint).
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

    const prefix = pc.bgCyan(pc.black(pc.bold(' DIST ')));
    const pkg = await Util.importPkgMeta(dir);
    const moduleName = pkg?.name || 'unknown';

    const table = LogTable();
    const indent = ' '.repeat(6);
    table.push([indent, 'bundle', `  ${bundle.length} files  `, bundleSize]);
    table.push([indent, 'types.d', `  ${types.length} files  `, typesSize]);
    table.push([indent, '', '', '-'.repeat(10)]);
    table.push([indent, '', '', size.toString()]);

    console.info(``);
    console.info(pc.gray(`${prefix} ${pc.cyan(pc.bold(moduleName))}`));
    console.info(pc.gray(table.toString()));
    console.info('');
  }

  return { ok: true, errorCode: 0 };
}
