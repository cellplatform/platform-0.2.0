import { ManifestFiles, ManifestHash } from '../Manifest';
import { DEFAULT, Path, t, Time } from './common.mjs';
import { MockState } from './MockState.mjs';

import type { GetStateMap } from './MockState.mjs';

type DirString = string;

export type MockIndexer = {
  driver: t.FsIndexer;
  count: { manifest: number };
};

/**
 * Mock in-memory filesystem [Indexer] implementation.
 */
export function FsMockIndexer(args: { dir?: DirString; getState?: GetStateMap } = {}): MockIndexer {
  const rootDir = Path.ensureSlashes(args.dir ?? DEFAULT.rootdir);

  const driver: t.FsIndexer = {
    dir: rootDir,

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

      if (options.dir) {
        let filterDir = formatPath(options.dir);
        if (filterDir) {
          filterDir = Path.ensureSlashEnd(filterDir);
          files = files.filter((file) => {
            const dir = Path.parts(file.path).dir;
            return Path.ensureSlashEnd(dir).startsWith(filterDir);
          });
        }
      }

      if (options.filter) {
        files = files.filter((file) => {
          const is = { dir: false, file: true };
          const args: t.FsPathFilterArgs = { path: file.path, is };
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
    driver,
    count: { manifest: 0 },
  };

  return mock;
}
