import { Paths } from '../Paths.mjs';
import { R, Util, type t } from '../common/index.mjs';

const PackageJson = Util.PackageJson;

type M = {
  name: string;
  version: t.VersionString;
  path: t.DirString;
  deps: D[];
};
type D = {
  name: string;
  version: t.VersionString;
  isDev: boolean;
  isLocal: boolean;
};
type C = {
  target: 'root' | 'module';
  module: string;
  dep: { name: string; isDev: boolean };
  version: { from: string; to: string };
};

/**
 * Helpers for operating on package versions.
 */
export const Dependencies = {
  /**
   * Examines the given module's dependencies:
   *
   *  1.  Ensure each external dependency referenced in the module is
   *      also referenced on the root [package.json], aka "global workspace".
   *
   *  2a. Ensure the latest semver between the root and the module is used on both of them.
   *  2b. Ensure the "hightest version used" scope extends across all modules within the "global workspace".
   *
   */
  async syncVersions(options: { filter?: t.PathFilter; save?: boolean; useMax?: boolean } = {}) {
    const { filter, save = true, useMax = true } = options;

    const loadRootPackage = () => PackageJson.load(Paths.rootDir);
    let rootPkg = await loadRootPackage();
    const allModules = await Dependencies.buildGraph();
    const changes: C[] = [];

    for (const module of filterGraph(allModules, { filter })) {
      const rootDeps = PackageJson.deps.get(rootPkg);

      const loadModulePackage = () => PackageJson.load(module.path);
      let modulePkg = await loadModulePackage();

      const registerChange = (target: C['target'], module: string, toVersion: string, dep: D) => {
        const { name, isDev } = dep;
        const version = { from: dep.version, to: toVersion };
        if (!Util.Version.eq(version.from, version.to)) {
          changes.push({ target, module, dep: { name, isDev }, version });
        }
      };

      for (const dep of module.deps) {
        if (dep.isLocal) {
          // This is a [LOCAL] inter-module reference.
          //    Ensure current version from source.
          const source = allModules.find((item) => item.name === dep.name);
          if (source) {
            const version = source.version;
            modulePkg = PackageJson.deps.set(modulePkg, dep.name, version, dep.isDev);
            registerChange('module', module.name, version, dep);
          }
        } else {
          // This is an [EXTERNAL] module.
          // Ensure the latest version exists on both the ROOT and the MODULE.
          const existsInRoot = rootDeps.exists(dep.name);
          const rootVersion = rootDeps.all[dep.name];
          const depVersion = dep.version;

          if (existsInRoot) {
            // Reference is accounted for in the root - ensure we have the latest version.
            const version = useMax ? Util.Version.max(rootVersion, depVersion) : rootVersion;
            if (dep.version !== version) {
              modulePkg = PackageJson.deps.set(modulePkg, dep.name, version, dep.isDev);
              registerChange('module', module.name, version, dep);
            }
          }

          const isDifferentFromRoot = !rootDeps.eq(dep.name, dep.version);
          if (!existsInRoot || isDifferentFromRoot) {
            // Not accounted for in the root.
            //    Add it to the root now.
            const { name } = dep;
            const version = useMax ? Util.Version.max(rootVersion, depVersion) : rootVersion;
            rootPkg = PackageJson.deps.set(rootPkg, name, version, dep.isDev);
            registerChange('root', module.name, version, dep);
          }
        }
      }

      // Save the module [package.json] file.
      const isChanged = !R.equals(await loadModulePackage(), modulePkg);
      if (save && isChanged) {
        await savePkg(module.path, modulePkg);
      }
    }

    // Save root [package.json] file.
    const isRootChanged = !R.equals(await loadRootPackage(), rootPkg);
    if (save && isRootChanged) {
      await savePkg(Paths.rootDir, rootPkg);
    }

    // Finish up.
    return { changes };
  },

  /**
   * Builds a topologically sorted list of dependencies within the system.
   */
  async buildGraph(options: { filter?: t.PathFilter; sortBy?: t.SortModulesBy } = {}) {
    const { sortBy = 'Topological' } = options;
    const allPaths = await Util.Find.projectDirs({ sortBy });

    const pkgCache: { [dir: string]: t.PkgJson } = {};
    const getPkg = async (dir: string): Promise<t.PkgJson> => {
      if (!pkgCache[dir]) pkgCache[dir] = await PackageJson.load(dir);
      return pkgCache[dir];
    };

    const initRef = async (path: t.DirString): Promise<M> => {
      const pkg = await getPkg(path);
      const { name, version } = pkg;
      return { name, version, path, deps: [] };
    };

    const populateDeps = async (module: M) => {
      const pkg = await getPkg(module.path);
      const add = (isDev: boolean, deps: t.PkgDeps = {}) => {
        Object.keys(deps).forEach((name) => {
          const version = deps[name];
          const isLocal = modules.some((m) => m.name === name);
          module.deps.push({ name, version, isDev, isLocal });
        });
      };
      add(false, pkg.dependencies);
      add(true, pkg.devDependencies);
    };

    // Build up graph meta-data.
    const modules: M[] = await Promise.all(allPaths.map(initRef));
    await Promise.all(modules.map(populateDeps));

    // Finish up.
    return filterGraph(modules, options);
  },
};

/**
 * Helpers
 */

function filterGraph(modules: M[], options: { filter?: t.PathFilter } = {}) {
  const filter: t.PathFilter = (path) => {
    if (!options.filter) return true;
    if (path.startsWith(Paths.rootDir)) path = path.substring(Paths.rootDir.length);
    return options.filter?.(path);
  };
  return modules.filter((module) => filter(module.path));
}

const savePkg = async (path: string, pkg: t.PkgJson) => {
  return PackageJson.save(path, PackageJson.deps.clean(pkg));
};
