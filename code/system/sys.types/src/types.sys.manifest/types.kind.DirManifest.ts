import type { t } from '../common';

type Timestamp = number; // UTC: milliseconds since the UNIX epoch.
type Sha256 = string;

/**
 * Details about a compiled Module ("bundle of code").
 */
export type DirManifest = t.Manifest<DirManifestFile, DirManifestHash> & {
  kind: 'dir';
  dir: DirManifestInfo;
};

export type DirManifestHash = t.ManifestHash & {
  dir: Sha256; // Hash of files and meta-data: sha256({ dir, files })
};
export type DirManifestFile = t.ManifestFile;
export type DirManifestInfo = { indexedAt: Timestamp };
