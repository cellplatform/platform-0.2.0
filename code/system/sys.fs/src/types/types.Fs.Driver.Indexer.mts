import { t } from './common.mjs';

type DirPathString = string;

export type FsPathFilter = (e: FsPathFilterArgs) => boolean;
export type FsPathFilterArgs = { path: string; is: { dir: boolean; file: boolean } };

/**
 * Index of a file-system.
 */
export type FsIndexer = {
  readonly dir: DirPathString; // Root directory of the file-system.
  manifest: FsIndexerGetManifest;
};

/**
 * Generate a directory listing manifest.
 */
export type FsIndexerGetManifest = (
  options?: FsIndexerGetManifestOptions,
) => Promise<t.DirManifest>;
export type FsIndexerGetManifestOptions = { dir?: DirPathString; filter?: FsPathFilter };
