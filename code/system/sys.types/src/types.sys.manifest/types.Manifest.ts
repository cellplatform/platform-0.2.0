import type { t } from '../common';

type Sha256 = string;

export type Manifest<
  F extends t.ManifestFile = t.ManifestFile,
  H extends ManifestHash = ManifestHash,
> = {
  hash: H;
  files: F[];
};

export type ManifestHash = {
  files: Sha256; // The hash of all [filehash] values in the manifest [files] list.
};

/**
 * URL (Uniform Resource Locator) pointing to a manifest.
 * Takes the form of:
 *
 *    <domain>/<path>/<filename.json>?entry=<path>
 *
 * Notes:
 *
 *    1. Entry query-string is optional (and is an ESM "export" entry).
 *
 */
export type ManifestUrl = string;
