import { Hash, Path, t, Wrangle } from '../common';
import { NodeFs } from '../node';

type DirPath = string;

/**
 * A filesystem I/O driver running against the [fs] node-js interface.
 */
export function FsIO(args: { dir: DirPath }) {
  const root = Path.ensureSlashes(args.dir);

  const driver: t.FsIO = {
    dir: root,
    resolve: Path.Uri.resolver(root),

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      const params = await Wrangle.io.info(root, address);
      const { uri, path, location, error } = params;
      if (error) return error;

      type T = t.FsDriverInfo;
      let kind: T['kind'] = 'unknown';
      let hash: T['hash'] = '';
      let bytes: T['bytes'] = -1;

      const fullpath = Path.trimFilePrefix(location);
      const exists = await NodeFs.pathExists(fullpath);

      if (exists) {
        const stats = await NodeFs.stat(fullpath);
        if (kind === 'unknown' && stats.isFile()) kind = 'file';
        if (kind === 'unknown' && stats.isDirectory()) kind = 'dir';
        if (kind == 'file') bytes = stats.size;
        if (kind === 'file') {
          const data = await NodeFs.readFile(fullpath);
          hash = Hash.sha256(data);
        }
      }

      return { uri, exists, kind, path, location, hash, bytes };
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      const params = await Wrangle.io.read(root, address);
      const { error, path, location } = params;
      if (error) return error;

      const fullpath = Path.trimFilePrefix(location);
      const exists = await NodeFs.pathExists(fullpath);
      if (!exists) return params.response404();

      try {
        const buffer = await NodeFs.readFile(fullpath);
        const data = new Uint8Array(buffer);
        const hash = Hash.sha256(data);
        const bytes = data.byteLength;
        return params.response200({ path, location, data, hash, bytes });
      } catch (error: any) {
        return params.response500(error);
      }
    },

    /**
     * Write to the local file-system.
     */
    async write(address, payload) {
      const params = await Wrangle.io.write(root, address, payload);
      const { error, file } = params;
      if (error) return error;

      try {
        const path = Path.trimFilePrefix(file.location);
        await NodeFs.ensureDir(NodeFs.dirname(path));
        await NodeFs.writeFile(path, file.data);
        return params.response200();
      } catch (error: any) {
        return params.response500(error);
      }
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      const params = await Wrangle.io.delete(root, input);
      const { items, error } = params;
      if (error) return error;

      const remove = async (location: string) => {
        const path = Path.trimFilePrefix(location);
        if (!(await NodeFs.pathExists(path))) return false;
        await NodeFs.remove(path);
        return true;
      };

      try {
        const res = await Promise.all(
          items.map(async (item) => ({ ...item, removed: await remove(item.location) })),
        );
        const uris = res.filter(({ removed }) => removed).map(({ uri }) => uri);
        return params.response200(uris);
      } catch (error: any) {
        return params.response500(error);
      }
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      const params = await Wrangle.io.copy(root, sourceUri, targetUri);
      const { source, target, error } = params;
      if (error) return error;

      try {
        const sourcePath = Path.trimFilePrefix(source.location);
        const targetPath = Path.trimFilePrefix(target.location);
        if (!(await NodeFs.pathExists(sourcePath))) return params.response404();

        await NodeFs.copy(sourcePath, targetPath);
        return params.response200();
      } catch (error: any) {
        return params.response500(error);
      }

      throw new Error('Not implemented - copy'); // TEMP 🐷
    },
  };

  return driver;
}
