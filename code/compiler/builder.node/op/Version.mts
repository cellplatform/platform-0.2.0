import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';

/**
 * Helpers for operating on package versions.
 */
export const Version = {
  /**
   * Examines the given module's dependencies:
   *
   *  1. Ensuring the dependency is registered in the root workspoace (if an external vendor package)
   *  2. Ensure each reference (module and root workspace) is set to  the latest version.
   *
   */
  async sync(moduleDir: t.PathString) {
    //
    moduleDir = fs.resolve(moduleDir);
    console.log('sync', moduleDir);

    const rootPkg = await Util.PackageJson.load(Paths.rootDir);
    const modulePkg = await Util.PackageJson.load(moduleDir);

    console.log('rootPkg.name', rootPkg.name);
    console.log('modulePkg.name', modulePkg.name);

    console.log('-------------------------------------------');

    console.log('modulePkg.dependencies', modulePkg.dependencies);
  },
};
