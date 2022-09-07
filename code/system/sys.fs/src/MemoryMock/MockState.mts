import { Manifest, Path, t } from './common.mjs';

export type StateMap = { [path: string]: StateMapFile };
export type StateMapFile = { data: Uint8Array; hash: string };
export type GetStateMap = () => StateMap;

/**
 * Simple in-memory state store for file data.
 */
export const MockState = {
  toManifestFiles(state?: StateMap): t.ManifestFile[] {
    if (!state) return [];

    const files = Object.keys(state)
      .map((path) => MockState.toManifestFile(path, state[path]))
      .filter(Boolean);

    return Manifest.Files.sort(files);
  },

  toManifestFile(path: string, file: StateMapFile): t.ManifestFile {
    return {
      path: Path.trimSlashesStart(path),
      bytes: file.data.byteLength,
      filehash: file.hash,
    };
  },
};
