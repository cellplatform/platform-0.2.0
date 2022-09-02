import { t, PathResolverFactory, Path, Hash } from '../common/index.mjs';
import { NodeFs } from '../node/NodeFs/index.mjs';

/**
 * A filesystem driver running against the "node-js" POSIX interface.
 */
export function FsDriver(options: { dir?: string } = {}): t.FsDriver {
  const dir = formatRootDir(options.dir ?? '/');
  const root = dir;

  const resolve = PathResolverFactory({ dir });

  const driver: t.FsDriver = {
    /**
     * Root directory of the file system.
     * NOTE:
     *    This will always be "/". The IndexedDb implementation of the driver
     *    works with it's own root database and is not a part of a wider file-system.
     */
    dir,

    /**
     * Convert the given string to an absolute path.
     */
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(uri) {
      uri = (uri || '').trim();
      const path = resolve(uri);
      const location = Path.toAbsoluteLocation({ path, root });

      type T = t.FsDriverInfo;
      let kind: T['kind'] = 'unknown';
      let hash: T['hash'] = '';
      let bytes: T['bytes'] = -1;

      const exists = await NodeFs.pathExists(path);

      if (exists) {
        const stats = await NodeFs.stat(path);
        if (kind === 'unknown' && stats.isFile()) kind = 'file';
        if (kind === 'unknown' && stats.isDirectory()) kind = 'dir';
        if (kind !== 'unknown') bytes = stats.size;
        if (kind === 'file') {
          const data = await NodeFs.readFile(path);
          hash = Hash.sha256(data);
        }
      }

      return {
        uri,
        exists,
        kind,
        path: path.substring(dir.length - 1), // NB: hide full path up to root of driver scope.
        location,
        hash,
        bytes,
      };
    },

    /**
     * Read from the local file-system.
     */
    async read(uri) {
      throw new Error('not implemented');
    },

    /**
     * Write to the local file-system.
     */
    async write(uri, input) {
      throw new Error('not implemented');
    },

    /**
     * Delete from the local file-system.
     */
    async delete(uri) {
      throw new Error('not implemented');
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      throw new Error('not implemented');
    },
  };

  return driver;
}

/**
 * Helpers
 */
function formatRootDir(path: string) {
  path = Path.trim(path);
  path = Path.ensureSlashStart(path);
  path = Path.ensureSlashEnd(path);
  return path;
}
