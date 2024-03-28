import { BundlePaths as Bundle, Path } from './common.mjs';

function toDataPath(input: string) {
  const path = Path.join(Bundle.data.base, Bundle.data.md, input);
  return Path.toAbsolutePath(path);
}

export const Paths = {
  Bundle,
  toDataPath,

  /**
   * Data Stores (Schema)
   */
  schema: {
    index: toDataPath('index.md'),
    README: toDataPath('README.md'),
  },
};
