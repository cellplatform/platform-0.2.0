import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Package } from './Package.mjs';

export const PackageDist = {
  async generate(root: t.DirString) {
    root = fs.resolve(root);
    const dist = fs.join(root, Paths.dist);

    const projectPkg = await Util.PackageJson.load(root);
    const { name, version } = projectPkg;

    let pkg: t.PackageJson = {
      name,
      version,
      type: 'module',
    };

    pkg = await Package.updateEsmEntries(root, pkg);

    // Save.
    await Util.PackageJson.save(dist, pkg);
  },
};
