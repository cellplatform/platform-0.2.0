import { BundlePaths, Path } from './common.mjs';

function toDataPath(input: string) {
  const path = Path.join(BundlePaths.data.md, input);
  return Path.toAbsolutePath(path);
}

export const Paths = {
  BundlePaths,
  toDataPath,

  /**
   * Data Stores (Schema)
   */
  schema: {
    index: toDataPath('index.md'), // TODO: Declare as part of a "Package Data Schema".
  },
};
