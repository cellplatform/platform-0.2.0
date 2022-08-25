import * as t from '../common/types.mjs';

export type FsIndexedDb = t.Disposable & {
  id: string;
  version: number;
  driver: t.FsDriverLocal;
  index: t.FsIndexer;
};

/**
 * IndexedDB structures.
 */
type FilePath = string;
type FileDir = string;
type FileHash = string;
export type BinaryRecord = { hash: FileHash; data: Uint8Array };
export type PathRecord = {
  path: FilePath;
  dir: FileDir;
  hash: FileHash;
  bytes: number;
  image?: t.ManifestFileImage;
};
