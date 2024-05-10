/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { Disposable, EventBus } from 'sys.types/src/types';

export type {
  DirManifest,
  DirManifestInfo,
  FsDriver,
  FsDriverFactory,
  FsDriverFile,
  FsDriverInfo,
  FsError,
  FsIO,
  FsIndexer,
  Manifest,
  ManifestFile,
} from 'sys.fs/src/types';

export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';

/**
 * @local
 */
export * from '../types.mjs';

/**
 * IndexedDB table structures.
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
};
