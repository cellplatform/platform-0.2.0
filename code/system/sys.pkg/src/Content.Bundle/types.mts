type DirPath = string;
type S = { bytes: number; size: string };
type Size = { total: S; lib: S; data: { md: S } };

export type BundlePaths = {
  latest: DirPath;
  app: {
    base: DirPath;
    lib: DirPath;
  };
  data: {
    base: DirPath;
    md: DirPath;
    log: DirPath;
  };
};

export type BundleLogEntry = {
  kind: 'pkg:content-bundle';
  version: string;
  paths: BundlePaths;
  size: Size;
};
