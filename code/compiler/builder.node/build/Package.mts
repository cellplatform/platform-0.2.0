import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Template } from '../Template.mjs';

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
    const pkg = await Util.loadJsonFile<t.PackageJson>(pkgPath);
    const config = await Package.loadManifestFiles(rootDir);

    const exports: t.PackageJsonExports = {};
    const typesVersions: t.PackageJsonTypesVersions = { '*': {} };

    for (const key of Object.keys(config.esm.exports ?? {})) {
      const path = config.esm.exports[key];
      const match = Object.values(config.manifest).find((file) => {
        return path === Util.ensureRelativeRoot(file.src);
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
      if (Util.objectHasKeys(typesVersions['*'])) next = { ...next, typesVersions };
      if (Util.objectHasKeys(exports)) next = { ...next, exports };

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
    const ext = fs.extname(src);
    const file = `./types/${key}.d${ext}`;
    const filepath = fs.join(fs.resolve(rootDir), file);
    return (await fs.pathExists(filepath)) ? { src, key, file } : undefined;
  },

  /**
   * Load build related JSON files.
   */
  async loadManifestFiles(root: t.PathString) {
    await Template.ensureExists('esm.json', root);

    const target = {
      manifest: fs.join(root, Paths.buildManifest),
      esm: fs.join(root, Paths.tmpl.esmConfig),
    };

    const manifest = await Util.loadJsonFile<t.ViteManifest>(target.manifest);
    const esm = await Util.loadJsonFile<t.EsmConfig>(target.esm);

    return { manifest, esm };
  },
};
