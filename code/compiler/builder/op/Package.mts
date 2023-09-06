import { fs, R, Util, type t } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Vite } from './Vite.mjs';

type StringMap = { [key: string]: string };
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

    const { name, version } = pkgRoot;
    const pkgDist: t.PkgJson = { name, version, type: 'module' };

    const metaRoot = await Package.metadata({ root, subdir });
    const metaDist = await Package.metadata({ root });

    const save = async (path: string, pkg: t.PkgJson, meta?: PkgMeta) => {
      const file = { ...pkg, ...meta };
      await Util.PackageJson.save(path, file);
    };

    await save(root, pkgRoot, metaRoot);
    await save(fs.join(root, subdir), pkgDist, metaDist);
  },

  /**
   * Generate the {exports} and {typesVersions} fields
   * for the [package.json] file.
   */
  async metadata(args: {
    root: t.DirString;
    subdir?: string; // eg. '/dist/' if building a [package.json] at a higher level than the 'dist/' folder itself.
    defaultTarget?: t.ViteTarget;
  }): Promise<PkgMeta | undefined> {
    const { subdir = '' } = args;
    const root = fs.resolve(args.root);
    const { config, targets } = await Vite.loadConfig(root);
    const builds = await Wrangle.distDirs(root);
    const libEntry = Wrangle.libEntry(root, config);
    if (!libEntry) return undefined;

    const Exports = {
      mutable: {} as t.PkgJsonExports,
      get sorted() {
        return sortKeys(Exports.mutable);
      },
    };

    let _types = '';
    const Types = {
      mutable: {} as t.PkgJsonTypesVersionsFiles,
      get hasTypes() {
        return Object.keys(Types.mutable).length > 0;
      },
      get versions() {
        const obj = sortKeys(Types.mutable);
        Object.keys(obj).forEach((key) => (obj[key] = R.uniq(obj[key])));
        return Types.hasTypes ? { '*': obj } : undefined;
      },
      defaultType(target: t.ViteTarget) {
        const list = R.uniq(Types.target(target));
        return list.find((path) => path.endsWith('/index.d.mts')) ?? '';
      },
      target(key: string) {
        const list = Types.mutable[key] ?? (Types.mutable[key] = []);
        return list;
      },
    };

    const formatPath = (path: string) => {
      if (subdir) path = fs.join(subdir, path);
      return Util.ensureRelativeRoot(path);
    };

    const appendBundleFile = async (args: {
      entry: { key: string; path: string };
      target: t.ViteTarget;
      targets: t.ViteTarget[];
      files: t.ViteManifestFile[];
    }) => {
      const { entry, target, targets, files } = args;
      const manifest = files.find((file) => file.src === args.entry.path);
      if (manifest?.isEntry) {
        const key = Wrangle.exportKey(targets, target, entry.key);
        const filePath = formatPath(fs.join(args.target, manifest.file));
        Exports.mutable[key] = filePath;
      }
    };

    const appendType = async (args: {
      entry: { key: string; path: string };
      target: t.ViteTarget;
      targets: t.ViteTarget[];
    }) => {
      const { entry, target, targets } = args;
      const isIndex = args.entry.key === 'index';
      const exportKey = Wrangle.exportKey(targets, target, entry.key);
      const type = Package.toTypeFile(entry.path);
      const typePath = formatPath(type.filepath);

      if (isIndex && Is.defaultTarget(targets, target)) {
        _types = typePath;
      }

      if (isIndex) {
        if (targets.length > 1) Types.target(target).push(typePath);
      } else {
        const key = Util.stripRelativeRoot(exportKey);
        Types.target(key).push(typePath);
      }
    };

    const processBuild = async (
      build: { dir: string; target: t.ViteTarget },
      targets: t.ViteTarget[],
    ) => {
      const { target } = build;
      const { files } = await Vite.loadManifest(build.dir);
      for (const key of Object.keys(libEntry)) {
        const entry = { key, path: libEntry[key] };
        await appendBundleFile({ entry, target, targets, files });
        await appendType({ entry, target, targets });
      }
    };

    // Process each build-target (eg: "web", "node").
    for (const build of builds) {
      await processBuild(build, targets);
    }

    // Process [default] build target.
    const defaultTarget = Wrangle.defaultTarget(targets);
    const defaultBuild = builds.find((build) => build.target === defaultTarget);
    if (defaultBuild) await processBuild(defaultBuild, [defaultTarget]);

    // Finish up.
    return {
      types: _types,
      exports: Exports.sorted,
      typesVersions: Types.versions,
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
function sortKeys<T extends Record<string, unknown>>(obj: T) {
  const keys = Object.keys(obj).sort();
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Record<string, any>) as T;
}

const Is = {
  defaultTarget(targets: t.ViteTarget[], subject?: t.ViteTarget): boolean {
    if (subject !== undefined) return targets[0] === subject;
    return targets.length === 1;
  },
};

const Wrangle = {
  defaultTarget(targets: t.ViteTarget[]) {
    /**
     * NB: The targets array order is determined within the
     *     [vite.config.mts] file.
     *
     *    Order matters in the [vite.config] configuration.
     *    The first specified target is assumed to be the
     *    default (base) target.
     *
     *    eg:
     *      export default Config.vite(import.meta.url, (e) => {
     *
     *        e.target('web');          // ← default target: "web"
     *        e.target('web', 'node');  // ← default target: "web"
     *        e.target('node', 'web');  // ← default target: "node"
     *
     *      });
     */
    return targets[0];
  },

  libEntry(root: t.DirString, config: t.ViteUserConfig) {
    const lib = config?.build?.lib;
    if (typeof lib !== 'object') return undefined;
    if (typeof lib.entry !== 'object') return undefined;

    const entry = lib.entry as StringMap;
    return Object.keys(entry).reduce((acc, key) => {
      acc[key] = entry[key].substring(root.length + 1);
      return acc;
    }, {} as StringMap);
  },

  exportKey(targets: t.ViteTarget[], target: t.ViteTarget, key: string) {
    let out = '';
    if (!Is.defaultTarget(targets)) out = target;
    if (key !== 'index') out = fs.join(out, key);
    out = Util.ensureRelativeRoot(out);
    return out === './' ? '.' : out;
  },

  async distDirs(root: t.DirString) {
    // Derive the list of paths to all builds (eg. "web" and/or "node" etc).
    const distDir = fs.join(fs.resolve(root), Paths.outDir.root);
    const pattern = fs.join(distDir, '*', Paths.viteBuildManifest);
    const match = await fs.glob(pattern);
    return match.map((manifest) => {
      const dir = fs.dirname(manifest);
      const target = fs.basename(dir) as t.ViteTarget;
      return { dir, target };
    });
  },
};
