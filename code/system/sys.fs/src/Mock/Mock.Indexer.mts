import { t, DEFAULT, Time } from './common.mjs';

type Options = { dir?: string };
type MockManifestHandler = (e: {
  options: t.FsIndexerGetManifestOptions;
  manifest: t.DirManifest;
}) => void;

export function FsMockIndexer(options: Options = {}) {
  const { dir = DEFAULT.ROOT_DIR } = options;

  let _manifestHandler: undefined | MockManifestHandler;

  const indexer: t.FsIndexer = {
    dir,

    async manifest(options = {}) {
      mock.count.manifest++;

      const manifest: t.DirManifest = {
        kind: 'dir',
        dir: { indexedAt: Time.now.timestamp },
        hash: { dir: '', files: '' },
        files: [],
      };
      _manifestHandler?.({ options, manifest });
      return manifest;
    },
  };

  const mock = {
    indexer,
    count: { manifest: 0 },
    manifest(handler: MockManifestHandler) {
      _manifestHandler = handler;
      return mock;
    },
  };

  return mock;
}
