import { t } from './common.mjs';
/**
 * The result of performing a Manifest validation whereby the
 * file-hash of each file in the manifest is compared with
 * the corresponding physical file on disk.
 */
export declare type ManifestValidation = {
    ok: boolean;
    dir: string;
    errors: t.ManifestValidationError[];
};
export declare type ManifestValidationError = {
    path: string;
    hash: {
        manifest: string;
        filesystem: string;
    };
    message: string;
};
