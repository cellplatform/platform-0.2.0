/**
 * NPM [package.json] file.
 */
export declare type NpmPackageJson = {
    name?: string;
    description?: string;
    version?: string;
    main?: string;
    types?: string;
    scripts?: NpmPackageFields;
    dependencies?: NpmPackageFields;
    devDependencies?: NpmPackageFields;
    peerDependencies?: NpmPackageFields;
    resolutions?: NpmPackageFields;
    license?: string;
    private?: boolean;
};
export declare type NpmPackageFields = {
    [key: string]: string;
};
export declare type NpmPackageFieldsKey = 'scripts' | 'dependencies' | 'devDependencies' | 'peerDependencies' | 'resolutions';
