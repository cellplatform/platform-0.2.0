import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Package } from './Package.mjs';
import { Vite } from './Vite.mjs';

export const PackageDist = {
  /**
   * Generate a [package.json] file for the /dist/ build output.
   */
  async generate(root: t.DirString) {
    const { name, version } = await Util.PackageJson.load(root);
    const { manifest } = await Vite.loadManifest(root);

    const pkg: t.PkgJson = {
      name,
      version,
      type: 'module',
    };

    // Update and save.
    root = fs.resolve(root, Paths.dist);
    const esm = await Package.updateEsmEntries({ root, pkg, manifest });
    await Util.PackageJson.save(root, esm);
  },
};
