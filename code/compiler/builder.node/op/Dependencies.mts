import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';

/**
 * Helpers for operating on package versions.
 */
export const Dependencies = {
  /**
   * Examines the given module's dependencies:
   *
   *  1.  Ensure each external dependency reference in the module is
   *      also referenced on the root [package.json], aka "global workspace".
   *
   *  2a. Ensure the latest semver between the root and the module is used on both of them.
   *  2b. Expand the "hightest verion used" scope extends across all modules within the "global workspace".
   *
   */
  async ensureInSyncWithRoot(moduleDir: t.PathString) {
    //
    moduleDir = fs.resolve(moduleDir);
    console.log('sync', moduleDir);

    const rootPkg = await Util.PackageJson.load(Paths.rootDir);
    const modulePkg = await Util.PackageJson.load(moduleDir);

    console.log('version sync: ', rootPkg.name, '<==>', modulePkg.name);

    // console.log('-------------------------------------------');
    // console.log('modulePkg.dependencies', modulePkg.dependencies);
  },

  /**
   *
   */
  buildGraph() {
    //
    console.log('build graph');
  },
};
