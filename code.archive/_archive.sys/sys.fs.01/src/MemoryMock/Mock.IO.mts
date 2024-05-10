import { Wrangle } from '../Wrangle.mjs';
import { DEFAULT, Path, t } from './common.mjs';
import { StateMap } from './MockState.mjs';

export type MockDriverIO = {
  driver: t.FsIO;
  count: { info: number; read: number; write: number; delete: number; copy: number };
  getState(): StateMap;
};

/**
 * Mock in-memory filesystem [IO] driver implementation.
 */
export function FsMockIO(options: { dir?: string } = {}) {
  const root = Path.ensureSlashes(options.dir ?? DEFAULT.rootdir);

  const state: StateMap = {};
  const resolve = Path.Uri.resolver(root);
  const unpackUri = Path.Uri.unpacker(root);

  const resolveKind = (uri: string): t.FsDriverInfo['kind'] => {
    const { path } = unpackUri(uri);
    if (state[path]) return 'file';

    const possibleDir = `${path.replace(/\/*$/, '')}/`;
    if (possibleDir === '/') return 'dir'; // Test for "root directory" (special).

    const keys = Object.keys(state).map((key) => Path.Uri.trimUriPrefix(key));
    for (const key of keys) {
      if (key.startsWith(possibleDir) && key !== possibleDir) return 'dir';
    }

    return 'unknown';
  };

  const driver: t.FsIO = {
    dir: root,
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      mock.count.info++;

      const { uri, path, location, error } = await Wrangle.io.info(root, address);
      if (error) return error;

      const ref = state[path];
      const kind = resolveKind(uri);
      const exists = kind === 'dir' ? true : Boolean(ref);

      const info: t.FsDriverInfo = {
        uri,
        exists,
        kind,
        path,
        location,
        hash: ref?.hash ?? '',
        bytes: ref?.data.byteLength ?? -1,
      };

      return info;
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      mock.count.read++;

      const params = await Wrangle.io.read(root, address);
      const { error, path, location } = params;
      if (error) return error;

      const ref = state[path];
      if (ref) {
        const { hash, data } = ref;
        const bytes = data.byteLength;
        const file: t.FsDriverFile = { path, location, hash, bytes, data };
        return params.response200(file);
      } else {
        return params.response404();
      }
    },

    /**
     * Write to the local file-system.
     */
    async write(address, payload) {
      mock.count.write++;

      const params = await Wrangle.io.write(root, address, payload);
      const { error, file } = params;

      if (error) return error;
      const { data, hash, path } = file;

      state[path] = { data, hash };
      return params.response200();
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      mock.count.delete++;

      const params = await Wrangle.io.delete(root, input);
      const { error, items } = params;
      if (error) return error;

      const exists = items.filter((item) => Boolean(state[item.path]));
      exists.forEach(({ path }) => delete state[path]);
      return params.response200(exists.map(({ uri }) => uri));
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      mock.count.copy++;

      const params = await Wrangle.io.copy(root, sourceUri, targetUri);
      const { source, target, error } = params;
      if (error) return error;

      const ref = state[source.path];
      if (!ref) return params.response404();

      state[target.path] = ref;
      return params.response200();
    },
  };

  /**
   * Mock API wrapper of the in-memory <Driver>.
   */

  const mock: MockDriverIO = {
    driver,
    count: { info: 0, read: 0, write: 0, delete: 0, copy: 0 },
    getState() {
      return { ...state };
    },
  };

  return mock;
}
