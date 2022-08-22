import { t } from './common.mjs';
/**
 * A single file within a manifest.
 */
export declare type ManifestFile = {
    path: string;
    bytes: number;
    filehash: string;
    uri?: string;
    image?: t.ManifestFileImage;
    /**
     * Default: false.
     *    When false (not public) and redirecting to an S3 endpoint
     *    the target URL will be a "signed link" required to access
     *    the access-controlled S3 resource.
     */
    public?: boolean;
};
/**
 * Meta information about [image] file types.
 */
export declare type ManifestFileImage = {
    kind: 'png' | 'jpg' | 'svg';
    width: number;
    height: number;
};
