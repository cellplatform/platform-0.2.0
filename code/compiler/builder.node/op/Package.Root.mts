import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Package } from './Package.mjs';
import { Vite } from './Vite.mjs';

/**
 * Helpers for adjust a [package.json] file after a build operation.
 */
export const PackageRoot = {
  /**
   * Read the modules [exports.json] configuration file mapping to
   * generate the [package.json] { exports } index based on
   * the manifest output of Vite/Rollup.
   */
  async updateEsmEntries(root: t.DirString) {
    root = fs.resolve(root);
    const { manifest } = await Vite.loadManifest(root);
    const pkg = await Util.PackageJson.load(root);

    const subdir = Paths.dist;
    const esm = await Package.updateEsmEntries({ root, pkg, manifest, subdir, use: 'dist' });
    await Util.PackageJson.save(root, esm);
  },
};
