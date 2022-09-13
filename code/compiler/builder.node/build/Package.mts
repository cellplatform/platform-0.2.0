import { fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';
import { Vite } from './Vite.mjs';

export const Package = {
  /**
   * Updates the ESM entry points on a [package.json] based on the
   * build output within the given manifest.
   */
  async updateEsmEntries(root: t.DirString, pkg: t.PackageJson, options: { subdir?: string } = {}) {
    const { files } = await Vite.loadManifest(root);

    pkg = { ...pkg };
    delete pkg.exports;
    delete pkg.types;
    delete pkg.typesVersions;

    const ensureRelative = Util.ensureRelativeRoot;
    const formatPath = (path: string) => {
      if (options.subdir) path = fs.join(options.subdir, path);
      return Util.ensureRelativeRoot(path);
    };

    const entry = files.find((file) => file.isEntry);
    if (!entry) throw new Error(`Entry file not found. Package: ${pkg.name}`);

    const entryType = Package.toTypeFile(entry.src);
    const exports: t.PackageJsonExports = {};
    const typesFiles: t.PackageJsonTypesVersionsFiles = {};
    const typesVersions: t.PackageJsonTypesVersions = { '*': typesFiles };

    for (const item of files) {
      const type = await Package.findTypePath(root, item.src);
      if (type) {
        if (item.isEntry) exports['.'] = formatPath(item.file);
        if (item.isDynamicEntry) exports[ensureRelative(type.key)] = formatPath(item.file);
        if (type.filepath !== entryType.filepath) {
          typesFiles[type.key] = [formatPath(type.filepath)];
        }
      }
    }

    const appendField = (field: keyof t.PackageJson, value: any) => {
      pkg = { ...pkg };
      delete pkg[field];
      pkg = { ...pkg, [field]: value };
    };

    appendField('types', entryType.filepath);
    appendField('exports', exports);
    if (Object.keys(typesFiles).length > 0) appendField('typesVersions', typesVersions);

    return pkg;
  },

  /**
   * Looks for a [.d.ts] file within the [/types/] folder
   * corresponding to the given src [".ts"] file.
   */
  async findTypePath(root: t.DirString, src: t.PathString) {
    const type = Package.toTypeFile(src);
    const filepath = fs.join(fs.resolve(root), type.filepath);
    return (await fs.pathExists(filepath)) ? type : undefined;
  },

  /**
   * Parse a "/src/" file path into type parts.
   */
  toTypeFile(src: t.PathString) {
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
