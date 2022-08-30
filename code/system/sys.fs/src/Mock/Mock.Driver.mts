import { PathResolverFactory } from '../PathResolver/index.mjs';
import { DEFAULT, Hash, Path, Stream, t } from './common.mjs';

type MockInfoHandler = (e: { uri: string; info: t.IFsInfo }) => void;

/**
 * A driver used for mocking the file-system while testing.
 */
export function FsMockDriver(options: { dir?: string } = {}) {
  const { dir = DEFAULT.ROOT_DIR } = options;
  const root = dir;

  let _infoHandler: undefined | MockInfoHandler;
  const resolve = PathResolverFactory({ dir });
  const memory: { [uri: string]: { data: Uint8Array; hash: string } } = {};

  const formatUri = (uri: string) => {
    uri = Path.Uri.ensurePrefix(uri);
    const path = Path.Uri.trimPrefix(uri);
    const location = Path.toAbsoluteLocation({ root, path });
    return { uri, path, location };
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
      const ref = memory[uri];

      const info: t.IFsInfo = {
        uri,
        exists: Boolean(ref),
        kind: 'unknown',
        path,
        location,
        hash: ref?.hash ?? '',
        bytes: ref?.data.byteLength ?? -1,
      };

      _infoHandler?.({ uri, info });
      return info;
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      mock.count.read++;

      const { uri, path, location } = formatUri(address);
      const ref = memory[uri];

      if (ref) {
        const { hash, data } = ref;
        const bytes = data.byteLength;
        const file: t.IFsFileData = { path, location, hash, bytes, data };
        return { uri, ok: true, status: 200, file };
      } else {
        const error: t.FsError = { type: 'FS/read', message: 'Not found', path };
        return { uri, ok: false, status: 404, error };
      }
    },

    /**
     * Write to the local file-system.
     */
    async write(address, input) {
      mock.count.write++;

      const { uri, path, location } = formatUri(address);
      const data = Stream.isReadableStream(input)
        ? await Stream.toUint8Array(input)
        : (input as Uint8Array);

      const hash = Hash.sha256(input);
      const bytes = data.byteLength;
      const file: t.IFsFileData = { path, location, hash, bytes, data };
      const res: t.IFsWrite = { uri, ok: true, status: 200, file };

      memory[uri] = { data, hash };
      return res;
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      mock.count.delete++;

      const inputs = Array.isArray(input) ? input : [input];
      const items = inputs.map((input) => formatUri(input)).filter(({ uri }) => memory[uri]);
      const uris = items.map(({ uri }) => uri);
      const locations = items.map(({ location }) => location);

      items.forEach(({ uri }) => delete memory[uri]);
      return { ok: true, status: 200, uris, locations };
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      mock.count.copy++;

      const source = formatUri(sourceUri);
      const target = formatUri(targetUri);
      const ref = memory[source.uri];

      if (!ref) {
        const path = source.path;
        const error: t.FsError = { type: 'FS/copy', message: 'Source not found', path };
        return { ok: false, status: 404, source: source.uri, target: target.uri, error };
      }

      delete memory[source.uri];
      memory[target.uri] = ref;

      return {
        ok: true,
        status: 200,
        source: source.uri,
        target: target.uri,
      };
    },
  };

  const mock = {
    driver,
    count: { info: 0, read: 0, write: 0, delete: 0, copy: 0 },

    onInfo(handler: MockInfoHandler) {
      _infoHandler = handler;
      return mock;
    },
  };

  return mock;
}
