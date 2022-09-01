import type { ManifestFileImage } from 'sys.fs/src/types.mjs';

/**
 * @system
 */
export type { FsDriver, IFsInfo, FsError } from 'sys.fs/src/types.mjs';

/**
 * @local
 */
export { ManifestFileImage };
export * from '../types.mjs';

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
  image?: ManifestFileImage;
};
