/**
 * NPM [package.json] file.
 */
export type NpmPackageJson = {
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

export type NpmPackageFields = { [key: string]: string };
export type NpmPackageFieldsKey =
  | 'scripts'
  | 'dependencies'
  | 'devDependencies'
  | 'peerDependencies'
  | 'resolutions';
