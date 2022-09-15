import { PackageRoot } from './op/Package.Root.mjs';
import { PackageDist } from './op/Packge.Dist.mjs';
import { Typescript } from './op/Typescript.mjs';
import { Vite } from './op/Vite.mjs';
import { fs, t } from './common/index.mjs';
import { Paths } from './Paths.mjs';
import { Template } from './Template.mjs';
import { Dependencies } from './op/Dependencies.mjs';

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
  options: { silent?: boolean; exitOnError?: boolean } = {},
) {
  const { silent = false, exitOnError = true } = options;
  dir = fs.resolve(dir);

  // Pre-build.
  await Template.ensureBaseline(dir);
  await Dependencies.ensureInSyncWithRoot(dir);

  // - Typescript.
  const tsBuildOutput = await Typescript.build(dir, { exitOnError, silent });
  if (!tsBuildOutput.ok) return tsBuildOutput;

  // - ESM bundling.
  const viteBuildOutput = await Vite.build(dir, { silent });
  if (!viteBuildOutput.ok) return viteBuildOutput;

  // Post build.
  await fs.move(fs.join(dir, Paths.types.dirname), fs.join(dir, Paths.types.dist));
  await PackageRoot.updateEsmEntries(dir);
  await PackageDist.generate(dir);
  // await BuildManifest.generate(dir);

  // Finish up.
  if (!silent) console.info('');
  return { ok: true, errorCode: 0 };
}
