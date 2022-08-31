import { ManifestHash, ManifestFiles } from '../Manifest/index.mjs';
import { DEFAULT, t, Time, Path, Hash } from './common.mjs';
import { randomFile } from './util.mjs';

type Options = { dir?: string };

export type MockManifestHandler = (e: MockManifestHandlerArgs) => void;
export type MockManifestHandlerArgs = {
  options: t.FsIndexerGetManifestOptions;
  addFile(path: string, data?: Uint8Array): MockManifestHandlerArgs;
};

export function FsMockIndexer(options: Options = {}) {
  const { dir = DEFAULT.ROOT_DIR } = options;

  let _onManifestReq: undefined | MockManifestHandler;

  const indexer: t.FsIndexer = {
    dir,

    async manifest(options = {}) {
      mock.count.manifest++;

      const indexedAt = Time.now.timestamp;
      const dir: t.DirManifestInfo = { indexedAt };
      let files: t.ManifestFile[] = [];

      const formatPath = (path: string) => {
        path = Path.Uri.trimPrefix(path);
        path = Path.trimSlashes(path);
        return path;
      };

      if (_onManifestReq) {
        const args: MockManifestHandlerArgs = {
          options,
          addFile(path, data) {
            path = formatPath(path);
            const uri = Path.Uri.ensurePrefix(path);

            data = data ?? randomFile().data;
            const bytes = data.byteLength;
            const filehash = Hash.sha256(data);

            files = files.filter((file) => file.path !== path); // NB: Ensure no repeats.
            files.push({ uri, path, filehash, bytes });
            return args;
          },
        };

        _onManifestReq(args);
      }

      if (options.dir) {
        const dir = formatPath(options.dir);
        files = files.filter((file) => file.path.startsWith(dir));
      }
      if (options.filter) {
        files = files.filter((file) => {
          const args: t.FsPathFilterArgs = { path: file.path, is: { dir: false, file: true } };
          return options.filter?.(args);
        });
      }
      files = ManifestFiles.sort(files);

      const hash = ManifestHash.dir(dir, files);
      const manifest: t.DirManifest = { kind: 'dir', dir, hash, files };
      return manifest;
    },
  };

  const mock = {
    indexer,
    count: { manifest: 0 },
    onManifestRequest(fn: MockManifestHandler) {
      _onManifestReq = fn;
      return mock;
    },
  };

  return mock;
}
