import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Package } from './Package.mjs';

export const PackageDist = {
  async generate(root: t.DirString) {
    root = fs.resolve(root);

    const projectPkg = await Util.PackageJson.load(root);
    const { name, version } = projectPkg;

    const pkg: t.PackageJson = {
      name,
      version,
      type: 'module',
    };

    // Update and save.
    const subdir = Paths.dist;
    const esm = await Package.updateEsmEntries(root, pkg, { subdir });
    await Util.PackageJson.save(fs.join(root, Paths.dist), esm);
  },
};
