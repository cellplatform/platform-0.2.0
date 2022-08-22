import { t } from '../common.mjs';
import { naturalCompare as compare } from './compare.mjs';
/**
 * Standard operations on a set of files represented by a manifest.
 */
export declare const ManifestFiles: {
    hash: (input: t.ManifestFile[] | t.Manifest<t.ManifestFile, t.ManifestHash>) => string;
    compare: typeof compare;
    sort<T extends string | t.ManifestFile>(items: T[]): T[];
};
