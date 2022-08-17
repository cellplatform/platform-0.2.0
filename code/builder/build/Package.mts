import { fs, t } from '../common.mjs';

const Path = {
  buildManifest: 'dist/manifest.json',
  exports: 'exports.json',
};

/**
 * Helpers for adjust a [package.json] file after a build operation.
 */
export const Package = {
  /**
   * Read the modules [exports.json] configuration file mapping to
   * generate the [package.json] { exports } index based on
   * the manifest output of Vite/Rollup.
   */
  async updateEsm(rootDir: t.PathString, options: { save?: boolean } = {}) {
    rootDir = fs.resolve(rootDir);

    const pkgPath = fs.join(rootDir, 'package.json');
    const pkg = await loadJsonFile<t.PackageJson>(pkgPath);
    const files = await Package.loadManifestFiles(rootDir);

    const exports: t.PackageJsonExports = {};
    const typesVersions: t.PackageJsonTypesVersions = { '*': {} };

    for (const key of Object.keys(files.exports)) {
      const path = files.exports[key];
      const match = Object.values(files.manifest).find(({ src }) => {
        return path === `./${stripRelativeRoot(src)}`;
      });
      if (match) {
        exports[key] = `./dist/${match.file}`;
        const type = await Package.findTypePath(rootDir, match.src);
        if (type && type.file !== pkg.types) {
          typesVersions['*'][type.key] = [type.file];
        }
      }
    }

    if (options.save) {
      const types = pkg.types;
      delete pkg.types;
      delete pkg.exports;
      delete pkg.typesVersions;
      let next = { ...pkg, types };
      if (hasKeys(typesVersions['*'])) next = { ...next, typesVersions };
      if (hasKeys(exports)) next = { ...next, exports };

      await fs.writeFile(pkgPath, `${JSON.stringify(next, null, '  ')}\n`);
    }

    return {
      saved: Boolean(options.save),
      typesVersions,
      exports,
    };
  },

  /**
   * Looks for a [.d.ts] file within the [/types/] folder
   * corresponding to the given src [".ts"] file.
   */
  async findTypePath(rootDir: t.PathString, src: t.PathString) {
    const key = src
      .replace(/^\.\//, '')
      .replace(/^src\//, '')
      .replace(/\.(m)?ts(x)?$/, '');
    const file = `./types/${key}.d.ts`;
    const filepath = fs.join(fs.resolve(rootDir), file);
    return (await fs.pathExists(filepath)) ? { src, key, file } : undefined;
  },

  /**
   * Load build related JSON files.
   */
  async loadManifestFiles(root: t.PathString) {
    const paths = {
      manifest: fs.resolve(fs.join(root, Path.buildManifest)),
      exports: fs.resolve(fs.join(root, Path.exports)),
    };

    if (!(await fs.pathExists(paths.exports))) {
      const tmpl = fs.resolve(fs.join('template', Path.exports));
      await fs.copy(tmpl, paths.exports);
    }

    const manifest = await loadJsonFile<t.ViteManifest>(paths.manifest);
    const exports = await loadJsonFile<t.PackageJsonExports>(paths.exports);
    return { manifest, exports };
  },
};

/**
 * Helpers
 */
async function loadJsonFile<T>(file: t.PathString) {
  return (await fs.readJson(fs.resolve(file))) as T;
}

function stripRelativeRoot(input: t.PathString) {
  return (input || '').replace(/^\.\//, '');
}

function hasKeys(input: any) {
  if (typeof input !== 'object') return false;
  return Object.keys(input).length > 0;
}
