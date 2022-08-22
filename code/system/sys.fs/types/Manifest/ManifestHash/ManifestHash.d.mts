import { t } from '../common.mjs';
/**
 * Standard generation of a SHA256 hashes.
 */
export declare const ManifestHash: {
    sha256: (input: any, options?: import("sys.util/types/Hash/Hash.mjs").HashOptions | undefined) => string;
    /**
     * SHA256 hash for a list of files.
     */
    files(input: t.ManifestFile[] | t.Manifest): string;
    /**
     * SHA256 hash for a [ModuleManifest].
     */
    module(info: t.ModuleManifestInfo, files: t.ManifestFile[]): t.ModuleManifestHash;
    /**
     * SHA256 hash for a [DirManifest].
     */
    dir(info: t.DirManifestInfo, files: t.ManifestFile[]): {
        files: string;
        dir: string;
    };
};
