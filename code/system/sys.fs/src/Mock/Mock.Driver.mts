import { t, DEFAULT } from './common.mjs';
import { PathResolverFactory } from '../Driver/index.mjs';
import { Path } from '../Path/index.mjs';

type MockInfoHandler = (e: { uri: string; info: t.IFsInfo }) => void;
// type MockReadHandler = (e: { uri: string }) => void;

/**
 * A driver used for mocking the file-system while testing.
 */
export function FsMockDriver(options: { dir?: string; handleInfo?: MockInfoHandler } = {}) {
  const { dir = DEFAULT.ROOT_DIR } = options;

  const TMP = null as any; // TEMP 🐷

  const resolve = PathResolverFactory({ dir });

  const driver: t.FsDriver = {
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(uri) {
      mock.count.info++;

      uri = (uri || '').trim();
      const path = resolve(uri).path;
      const location = Path.toAbsoluteLocation({ path, root: dir });

      const info: t.IFsInfo = {
        uri,
        exists: false,
        kind: 'unknown',
        path,
        location,
        hash: '',
        bytes: -1,
      };

      options.handleInfo?.({ uri, info });
      return info;
    },

    /**
     * Read from the local file-system.
     */
    async read(uri) {
      mock.count.read++;
      return TMP;
    },

    /**
     * Write to the local file-system.
     */
    async write(uri, input) {
      mock.count.write++;
      return TMP;
    },

    /**
     * Delete from the local file-system.
     */
    async delete(uri) {
      mock.count.delete++;
      return TMP;
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      mock.count.copy++;
      return TMP;
    },
  };

  const mock = {
    driver,
    count: { info: 0, read: 0, write: 0, delete: 0, copy: 0 },
  };

  return mock;
}
