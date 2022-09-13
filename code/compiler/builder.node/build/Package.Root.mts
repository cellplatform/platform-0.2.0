import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Template } from '../Template.mjs';
import { Package } from './Package.mjs';

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
    const subdir = Paths.dist;
    const pkg = await Util.PackageJson.load(root);
    const updated = await Package.updateEsmEntries(root, pkg, { subdir });
    await Util.PackageJson.save(root, updated);
  },

  /**
   * Load the vite builder related JSON files.
   */
  async loadEsmConfig(root: t.DirString) {
    await Template.ensureExists('esm.json', root);
    return Util.loadJson<t.EsmConfig>(fs.join(root, Paths.tmpl.esmConfig));
  },
};
