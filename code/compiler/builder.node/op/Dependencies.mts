import { fs, t, Util, semver, R } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';

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
  async ensureInSyncWithRoot____(moduleDir: t.PathString) {
    moduleDir = fs.resolve(moduleDir);

    const rootPkg = await PackageJson.load(Paths.rootDir);
    const modulePkg = await PackageJson.load(moduleDir);

    console.log('version sync: ', rootPkg.name, '<==>', modulePkg.name);

    // console.log('-------------------------------------------');
    // console.log('modulePkg.dependencies', modulePkg.dependencies);
  },

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
  async sync(options: { filter?: t.PathFilter } = {}) {
    const { filter } = options;

    const modules = await Dependencies.buildGraph();
    let rootPkg = await PackageJson.load(Paths.rootDir);
    const rootDeps = PackageJson.deps.get(rootPkg);

    const changes: C[] = [];
    const registerChange = (target: C['target'], module: string, toVersion: string, dep: D) => {
      const { name, isDev } = dep;
      const version = { from: dep.version, to: toVersion };
      changes.push({ target, module, dep: { name, isDev }, version });
    };

    const highestVersion = (a: string, b: string) => (semver.gte(a, b) ? a : b);

    for (const module of filterGraph(modules, { filter })) {
      const loadModulePackage = () => PackageJson.load(module.path);
      let modulePkg = await loadModulePackage();

      for (const dep of module.deps) {
        if (dep.isLocal) {
          // This is a [LOCAL] inter-module reference.
          // Ensure current version from source.
          const source = modules.find((item) => item.name === dep.name);
          if (source) {
            const version = source.version;
            registerChange('module', module.name, version, dep);
            modulePkg = PackageJson.deps.set(modulePkg, dep.name, version, dep.isDev);
          }
        } else {
          // This is an [EXTERNAL] module.
          // Ensure the latest version exists on both the ROOT and the MODULE.
          const existsInRoot = rootDeps.exists(dep.name);
          const rootVersion = rootDeps.all[dep.name];
          const depVersion = dep.version;
          const isSemver = Boolean(semver.valid(depVersion));

          console.log(dep.name, dep.version, 'depVersion', depVersion, isSemver);
          if (existsInRoot) {
            // Is accounted for in the root - ensure we have the latest version.
            const version = !isSemver ? rootVersion : highestVersion(rootVersion, depVersion);
            if (dep.version !== version) {
              registerChange('module', module.name, version, dep);
              modulePkg = PackageJson.deps.set(modulePkg, dep.name, version, dep.isDev);
            }
          } else {
            // Not accounted for in the root.
            // Add it to the root now.
            const { name, version } = dep;
            rootPkg = PackageJson.deps.set(rootPkg, name, version, dep.isDev);
            registerChange('root', module.name, version, dep);
          }
        }
      }

      const isChanged = !R.equals(await loadModulePackage(), modulePkg);
      console.log('isChanged', isChanged);

      await PackageJson.save(module.path, modulePkg, { filename: 'package.TMP.json' }); // TEMP 🐷
    }

    // console.log('-------------------------------------------');
    // console.log('changes', changes);

    const saveRoot = changes.some((c) => c.target === 'root');
    console.log('saveRoot', saveRoot);

    // TEMP 🐷
    await PackageJson.save(Paths.rootDir, rootPkg, { filename: 'package.TMP.json' }); // TEMP 🐷

    // Finish up.
    return { changes };
  },

  /**
   * Builds a topologically sorted list of dependencies within the system.
   */
  async buildGraph(options: { filter?: t.PathFilter } = {}) {
    const allPaths = await Util.Find.projectDirs({ sort: 'Topological' });

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
