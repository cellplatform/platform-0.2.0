import { fs, t, pc, Util } from '../common/index.mjs';
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
    const types = size.paths.filter((p) => p.includes(typedir));
    const bundle = size.paths.filter((p) => !p.includes(typedir));
    const typesSize = await Util.folderSize(fs.join(dir, Paths.types.dist));

    const prefix = pc.bgCyan(pc.bold(' dist '));
    const filesize = pc.bold(pc.white(size.toString()));
    const total = `${bundle.length} files, ${types.length} typefiles (${typesSize.toString()})`;

    console.info(``);
    console.info(pc.gray(`${prefix} ${filesize}`));
    console.info(pc.gray(`       ${total}`));
    console.info(``);
  }
  return { ok: true, errorCode: 0 };
}
