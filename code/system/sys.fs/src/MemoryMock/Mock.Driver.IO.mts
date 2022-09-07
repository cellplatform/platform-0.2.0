import { DEFAULT, Hash, Path, Stream, t, R } from './common.mjs';
import { StateMap } from './MockState.mjs';

export type MockInfoHandler = (e: MockInfoHandlerArgs) => void;
export type MockInfoHandlerArgs = {
  readonly uri: string;
  readonly path: string;
  modify(fn: (info: t.FsDriverInfo) => void): void;
};

export type MockDriverIO = {
  driver: t.FsDriverIO;
  count: { info: number; read: number; write: number; delete: number; copy: number };
  getState(): StateMap;
  onInfoRequest(fn: MockInfoHandler): MockDriverIO;
};

/**
 * Mock in-memory filesystem [IO] driver implementation.
 */
export function FsMockDriverIO(options: { dir?: string } = {}) {
  const { dir = DEFAULT.rootdir } = options;

  let _onInfoReq: undefined | MockInfoHandler;

  const state: StateMap = {};
  const resolve = Path.Uri.resolver(dir);
  const unpackUri = Path.Uri.unpacker(dir);

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

  const driver: t.FsDriverIO = {
    dir,
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      mock.count.info++;

      const { uri, path, location } = unpackUri(address);
      const ref = state[path];
      const kind = resolveKind(uri);
      const exists = kind === 'dir' ? true : Boolean(ref);

      let info: t.FsDriverInfo = {
        uri,
        exists,
        kind,
        path,
        location,
        hash: ref?.hash ?? '',
        bytes: ref?.data.byteLength ?? -1,
      };

      const args: MockInfoHandlerArgs = {
        uri,
        path,
        modify(fn) {
          const clone = R.clone(info);
          fn(clone);
          info = clone;
        },
      };

      _onInfoReq?.(args);
      return info;
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      mock.count.read++;

      const { uri, path, location, withinScope } = unpackUri(address);

      const toError = (message: string): t.FsError => ({ code: 'fs:read', message, path });
      if (!withinScope) return { uri, ok: false, status: 422, error: toError(`Path out of scope`) };

      const ref = state[path];
      if (ref) {
        const { hash, data } = ref;
        const bytes = data.byteLength;
        const file: t.FsDriverFileData = { path, location, hash, bytes, data };
        return { uri, ok: true, status: 200, file };
      } else {
        return { uri, ok: false, status: 404, error: toError('Not found') };
      }
    },

    /**
     * Write to the local file-system.
     */
    async write(address, input) {
      mock.count.write++;
      const { uri, path, location, withinScope } = unpackUri(address);

      /**
       * TODO 🐷
       * ISSUE: https://github.com/cellplatform/platform-0.2.0/issues/24
       *
       *    - put image meta-data (pixel size) on data data object.
       *    - ensure it shows up in Indexer <Manifest>
       *
       */
      //  const image = await Image.toInfo(path, data);

      const data = Stream.isReadableStream(input)
        ? await Stream.toUint8Array(input)
        : (input as Uint8Array);

      const hash = Hash.sha256(data);
      const bytes = data.byteLength;
      const file: t.FsDriverFileData = { path, location, hash, bytes, data };

      const toError = (message: string): t.FsError => ({ code: 'fs:write', message, path });
      if (!withinScope)
        return { uri, ok: false, status: 422, file, error: toError(`Path out of scope`) };

      state[path] = { data, hash };
      const res: t.FsDriverWrite = { uri, ok: true, status: 200, file };
      return res;
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      mock.count.delete++;

      const inputs = Array.isArray(input) ? input : [input];
      const formatted = inputs.map((input) => unpackUri(input));
      const items = formatted.filter((item) => state[item.path]);
      const uris = items.map(({ uri }) => uri);
      const locations = items.map(({ location }) => location);
      const outOfScope = formatted.filter((item) => !item.withinScope);

      if (outOfScope.length > 0) {
        const path = outOfScope.map((item) => item.rawpath).join('; ');
        const error: t.FsError = { code: 'fs:delete', message: 'Path out of scope', path };
        return { ok: false, status: 422, uris, locations, error };
      }

      items.forEach((item) => delete state[item.path]);
      return { ok: true, status: 200, uris, locations };
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      mock.count.copy++;

      const source = unpackUri(sourceUri);
      const target = unpackUri(targetUri);

      const toError = (path: string, message: string): t.FsError => ({
        code: 'fs:copy',
        message,
        path,
      });

      if (!source.withinScope) {
        const error = toError(source.rawpath, 'Source path out of scope');
        return { ok: false, status: 422, source: source.uri, target: target.uri, error };
      }

      if (!target.withinScope) {
        const error = toError(target.rawpath, 'Target path out of scope');
        return { ok: false, status: 422, source: source.uri, target: target.uri, error };
      }

      const ref = state[source.path];
      if (!ref) {
        const error = toError(source.rawpath, 'Source file not found');
        return { ok: false, status: 404, source: source.uri, target: target.uri, error };
      }

      state[target.path] = ref;

      return {
        ok: true,
        status: 200,
        source: source.uri,
        target: target.uri,
      };
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

    onInfoRequest(fn: MockInfoHandler) {
      _onInfoReq = fn;
      return mock;
    },
  };

  return mock;
}
