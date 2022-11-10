type S = { bytes: number; size: string };
type Size = { total: S; assets: S; data: { md: S } };

export type BundlePaths = {
  app: {
    base: string;
    lib: string;
  };
  data: {
    base: string;
    md: string;
    log: string;
  };
};

export type BundleLogEntry = {
  kind: 'pkg:content-bundle';
  version: string;
  paths: BundlePaths;
  size: Size;
};
