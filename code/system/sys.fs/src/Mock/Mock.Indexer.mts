import { t, DEFAULT, Time } from './common.mjs';

type Options = { dir?: string; handleManifest?: MockManifestHandler };
type MockManifestHandler = (e: {
  options: t.FsIndexerGetManifestOptions;
  manifest: t.DirManifest;
}) => void;

export function FsMockIndexer(options: Options = {}) {
  const { dir = DEFAULT.ROOT_DIR, handleManifest } = options;
  const indexer: t.FsIndexer = {
    dir,

    async manifest(options = {}) {
      mock.count.indexer++;

      const manifest: t.DirManifest = {
        kind: 'dir',
        dir: { indexedAt: Time.now.timestamp },
        hash: { dir: '', files: '' },
        files: [],
      };
      handleManifest?.({ options, manifest });
      return manifest;
    },
  };

  const mock = {
    indexer,
    count: { indexer: 0 },
  };

  return mock;
}
