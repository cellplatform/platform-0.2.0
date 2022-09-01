import { PathResolverFactory } from '../PathResolver/index.mjs';
import { DEFAULT, Hash, Path, Stream, t } from './common.mjs';

type MockInfoHandler = (e: { uri: string; info: t.IFsInfo }) => void;

/**
 * A driver used for mocking the file-system while testing.
 */
export function FsMockDriver(options: { dir?: string } = {}) {
  const { dir = DEFAULT.ROOT_DIR } = options;
  const root = dir;

  let _onInfoReq: undefined | MockInfoHandler;
  const resolve = PathResolverFactory({ dir });
  const state: { [uri: string]: { data: Uint8Array; hash: string } } = {};

  const formatUri = (uri: string) => {
    if (uri === 'path:') uri = 'path:.';
    const content = Path.trimSlashesStart(Path.Uri.trimPrefix(uri));
    const location = Path.toAbsoluteLocation({ root, path: content }).replace(/\/\.$/, '/');
    const path = Path.ensureSlashStart(content).replace(/\/\.$/, '/');
    const withinScope = Path.isWithin(root, path);
    uri = Path.Uri.ensurePrefix(content);
    return { uri, path, location, withinScope };
  };

  const toKind = (uri: string): t.IFsInfo['kind'] => {
    if (state[uri]) return 'file';

    const possibleDir = `${Path.Uri.trimPrefix(uri).replace(/\/*$/, '')}/`;
    if (possibleDir === './') return 'dir';

    const keys = Object.keys(state).map((key) => Path.Uri.trimPrefix(key));
    for (const key of keys) {
      if (key.startsWith(possibleDir) && key !== possibleDir) return 'dir';
    }

    return 'unknown';
  };

  const driver: t.FsDriver = {
    dir,
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      mock.count.info++;

      const { uri, path, location } = formatUri(address);
      const ref = state[uri];
      const kind = toKind(uri);
      const exists = kind === 'dir' ? true : Boolean(ref);

      const info: t.IFsInfo = {
        uri,
        exists,
        kind,
        path,
        location,
        hash: ref?.hash ?? '',
        bytes: ref?.data.byteLength ?? -1,
      };

      _onInfoReq?.({ uri, info });
      return info;
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      mock.count.read++;
      const { uri, path, location, withinScope } = formatUri(address);

      const toError = (message: string): t.FsError => ({ type: 'FS/read', message, path });
      if (!withinScope) return { uri, ok: false, status: 422, error: toError(`Path out of scope`) };

      const ref = state[uri];
      if (ref) {
        const { hash, data } = ref;
        const bytes = data.byteLength;
        const file: t.IFsFileData = { path, location, hash, bytes, data };
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
      const { uri, path, location, withinScope } = formatUri(address);

      const data = Stream.isReadableStream(input)
        ? await Stream.toUint8Array(input)
        : (input as Uint8Array);

      const hash = Hash.sha256(input);
      const bytes = data.byteLength;
      const file: t.IFsFileData = { path, location, hash, bytes, data };

      const toError = (message: string): t.FsError => ({ type: 'FS/write', message, path });
      if (!withinScope)
        return { uri, ok: false, status: 422, file, error: toError(`Path out of scope`) };

      state[uri] = { data, hash };
      const res: t.IFsWrite = { uri, ok: true, status: 200, file };
      return res;
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      mock.count.delete++;

      const inputs = Array.isArray(input) ? input : [input];
      const formatted = inputs.map((input) => formatUri(input));

      const items = formatted.filter(({ uri }) => state[uri]);
      const uris = items.map(({ uri }) => uri);
      const locations = items.map(({ location }) => location);
      const outOfScope = formatted.filter((item) => !item.withinScope);

      if (outOfScope.length > 0) {
        const path = outOfScope.map((item) => item.path).join('; ');
        return {
          ok: false,
          status: 422,
          uris,
          locations,
          error: { type: 'FS/delete', message: 'Path out of scope', path },
        };
      }

      items.forEach(({ uri }) => delete state[uri]);
      return { ok: true, status: 200, uris, locations };
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      mock.count.copy++;

      const source = formatUri(sourceUri);
      const target = formatUri(targetUri);

      const toError = (path: string, message: string): t.FsError => ({
        type: 'FS/copy',
        message,
        path,
      });

      if (!source.withinScope) {
        const error = toError(source.path, 'Source path out of scope');
        return { ok: false, status: 422, source: source.uri, target: target.uri, error };
      }

      if (!target.withinScope) {
        const error = toError(target.path, 'Target path out of scope');
        return { ok: false, status: 422, source: source.uri, target: target.uri, error };
      }

      const ref = state[source.uri];
      if (!ref) {
        const error = toError(source.path, 'Source file not found');
        return { ok: false, status: 404, source: source.uri, target: target.uri, error };
      }

      state[target.uri] = ref;

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
  const mock = {
    driver,
    count: { info: 0, read: 0, write: 0, delete: 0, copy: 0 },

    get state() {
      return { ...state };
    },

    onInfoRequest(fn: MockInfoHandler) {
      _onInfoReq = fn;
      return mock;
    },
  };

  return mock;
}
