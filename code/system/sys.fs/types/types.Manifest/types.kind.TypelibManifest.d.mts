import { t } from './common.mjs';
/**
 * Manifest of a library of ".d.ts" declaration files.
 */
export declare type TypelibManifest = t.Manifest<TypelibManifestFile, TypelibManifestHash> & {
    kind: 'typelib';
    typelib: t.TypelibManifestInfo;
};
export declare type TypelibManifestHash = t.ManifestHash;
export declare type TypelibManifestFile = t.ManifestFile & {
    declaration: t.TypelibManifestFileInfo;
};
export declare type TypelibManifestFileInfo = {
    imports: string[];
    exports: string[];
};
export declare type TypelibManifestInfo = {
    name: string;
    version: string;
    entry: string;
};
