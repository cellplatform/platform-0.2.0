import { fs, t, Util } from '../common';
import { Paths } from '../Paths.mjs';
import { Vite } from './Vite.mjs';

const join = fs.join;

type PkgMeta = {
  types: string;
  exports: t.PkgJsonExports;
  typesVersions?: t.PkgJsonTypesVersions;
};

export const Package = {
  /**
   * Generate a [package.json] file for the /dist/ build output.
   */
  async generate(root: t.DirString) {
    root = fs.resolve(root);
    const subdir = Paths.outDir.root;

    const pkgRoot = await Util.PackageJson.load(root);
    const metaRoot = await Package.meta({ root, subdir });

    const { name, version } = pkgRoot;
    const pkgDist: t.PkgJson = { name, version, type: 'module' };
    const metaDist = await Package.meta({ root });

    const save = async (path: string, pkg: t.PkgJson, meta: PkgMeta) => {
      const data = { ...pkg, ...meta };
      await Util.PackageJson.save(path, data);
    };

    await save(fs.join(root, subdir), pkgDist, metaDist);
    await save(root, pkgRoot, metaRoot);
  },

  /**
   * Generate {exports} object.
   */
  async meta(args: {
    root: t.DirString;
    subdir?: string; // eg. '/dist/' if building a [package.json] at a higher level that the 'dist/' folder itself.
    defaultTarget?: t.ViteTarget;
  }): Promise<PkgMeta> {
    const { subdir = '' } = args;
    const root = fs.resolve(args.root);
    const distDir = join(root, Paths.outDir.root);

    const { pathExists } = fs;
    if (!(await pathExists(distDir))) throw new Error(`Dist folder does not exist: ${distDir}`);

    const exports: t.PkgJsonExports = {};
    const typesFiles: t.PkgJsonTypesVersionsFiles = {};
    let types = '';

    const formatPath = (path: string) => {
      if (subdir) path = join(subdir, path);
      return Util.ensureRelativeRoot(path);
    };

    const append = async (target: t.ViteTarget, files: t.ViteManifestFile[]) => {
      const entry = files.find((file) => file.isEntry);
      if (!entry) throw new Error(`Entry file not found for target: "${target}". ${root}`);

      // Types.
      const entryType = Package.toTypeFile(entry.src);
      typesFiles[target] = [formatPath(entryType.filepath)];
      types = formatPath(entryType.filepath);

      // Exports reference.
      for (const item of files) {
        if (item.isEntry) {
          const key = Util.ensureRelativeRoot(target);
          exports[key] = formatPath(join(target, item.file));
        }

        /**
         * TODO 🐷
         * - add additional entry points here, when this is
         *   released within Vite.
         *
         * REF
         *    https://github.com/vitejs/vite/pull/7047#issuecomment-1248269393
         *    https://github.com/vitejs/vite/pull/10315
         *
         */
      }
    };

    // Derive the list of all builds ("web" and/or "node" etc).
    const pattern = join(distDir, '*', Paths.viteBuildManifest);
    const paths = (await fs.glob(pattern)).map((manifest) => {
      const dir = fs.dirname(manifest);
      const target = fs.basename(dir) as t.ViteTarget;
      return { dir, target };
    });

    // Process each build target.
    for (const item of paths) {
      const { files } = await Vite.loadManifest(item.dir);
      await append(item.target, files);
    }

    // Add root values.
    const defaultTarget = ((): t.ViteTarget => {
      if (paths.length === 1) return paths[0].target;
      return args.defaultTarget ?? 'web';
    })();
    exports['.'] = exports[Util.ensureRelativeRoot(defaultTarget)];

    // Finish up.
    const hasTypes = Object.keys(typesFiles).length > 0;
    return {
      types,
      exports: sortKeys(exports),
      typesVersions: hasTypes ? { '*': sortKeys(typesFiles) } : undefined,
    };
  },

  /**
   * Parse a "/src/" file path into type parts.
   */
  toTypeFile(src: t.PathString = '') {
    const key = src
      .replace(/^\.\//, '')
      .replace(/^src\//, '')
      .replace(/\.(m)?ts(x)?$/, '');
    const ext = fs.extname(src);
    const filename = `${key}.d${ext}`;
    const filepath = `./${Paths.types.dirname}/${filename}`;
    return { src, key, filename, filepath };
  },
};

/**
 * Helpers
 */

function sortKeys<T extends Object>(obj: T) {
  const keys = Object.keys(obj).sort();
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as T);
}
