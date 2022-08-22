import { t } from './common.mjs';
declare type Sha256 = string;
export declare type Manifest<F extends t.ManifestFile = t.ManifestFile, H extends ManifestHash = ManifestHash> = {
    hash: H;
    files: F[];
};
export declare type ManifestHash = {
    files: Sha256;
};
/**
 * URL (Uniform Resource Locator) pointing to a manifest.
 * Takes the form of:
 *
 *    <domain>/<path>/<filename.json>?entry=<path>
 *
 * Notes:
 *
 *    1. Path may, or may not be a "cell:<ns>:A1/fs/..."
 *    2. Entry query-string is optional (and is a compiler "export" entry).
 *
 */
export declare type ManifestUrl = string;
export {};
