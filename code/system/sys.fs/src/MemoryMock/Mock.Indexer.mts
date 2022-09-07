import { ManifestHash, ManifestFiles } from '../Manifest/index.mjs';
import { DEFAULT, t, Time, Path, Hash } from './common.mjs';
import { randomFile } from './util.mjs';
import { MockState, StateMap } from './MockState.mjs';

type DirString = string;

export type MockIndexer = {
  readonly indexer: t.FsIndexer;
  readonly count: { manifest: number };
  onManifestRequest(fn: MockManifestHandler): MockIndexer;
};

export type MockManifestHandler = (e: MockManifestHandlerArgs) => void;
export type MockManifestHandlerArgs = {
  readonly options: t.FsIndexerGetManifestOptions;
  addFile(path: string, data?: Uint8Array): MockManifestHandlerArgs;
};

/**
 * Mock in-memory filesystem [Indexer] implementation.
 */
export function FsMockIndexer(
  args: { dir?: DirString; getState?: () => StateMap } = {},
): MockIndexer {
  let dir = Path.ensureSlashes(args.dir ?? DEFAULT.rootdir);
  let _onManifestReq: undefined | MockManifestHandler;

  const indexer: t.FsIndexer = {
    dir,

    async manifest(options = {}) {
      mock.count.manifest++;

      const indexedAt = Time.now.timestamp;
      const dir: t.DirManifestInfo = { indexedAt };
      let files: t.ManifestFile[] = MockState.toManifestFiles(args.getState?.());

      const formatPath = (path: string) => {
        path = Path.Uri.trimUriPrefix(path);
        path = Path.trimSlashes(path);
        return path;
      };

      if (_onManifestReq) {
        const args: MockManifestHandlerArgs = {
          options,
          addFile(path, data) {
            path = formatPath(path);
            const uri = Path.Uri.ensureUriPrefix(path);

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

  /**
   * Mock API wrapper of the in-memory <Indexer>.
   */

  const mock: MockIndexer = {
    indexer,
    count: { manifest: 0 },

    onManifestRequest(fn: MockManifestHandler): typeof mock {
      _onManifestReq = fn;
      return mock;
    },
  };

  return mock;
}
