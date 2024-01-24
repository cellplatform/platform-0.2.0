import type { t } from '../common';

type DirPath = string;

export type FsPathFilter = (e: FsPathFilterArgs) => boolean;
export type FsPathFilterArgs = { path: string; is: { dir: boolean; file: boolean } };

/**
 * Index of a file-system.
 */
export type FsIndexer = {
  readonly dir: DirPath; // Root directory of the file-system.
  manifest: FsIndexerGetManifest;
};

/**
 * Generate a directory listing manifest.
 */
export type FsIndexerGetManifest = (
  options?: FsIndexerGetManifestOptions,
) => Promise<t.DirManifest>;
export type FsIndexerGetManifestOptions = { dir?: DirPath; filter?: FsPathFilter };
