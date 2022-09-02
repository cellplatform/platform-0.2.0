import { t, PathResolverFactory, Path } from '../common/index.mjs';

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
      throw new Error('not implemented');
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
