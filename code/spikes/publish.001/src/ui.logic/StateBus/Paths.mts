import { BundlePaths, Path } from './common.mjs';

function toDataPath(input: string) {
  const path = Path.join(BundlePaths.data.md, input);
  return Path.toAbsolutePath(path);
}

function toUiPath(input: string) {
  const path = Path.join('.transient.ui', input);
  return Path.toAbsolutePath(path);
}

export const Paths = {
  BundlePaths,

  toDataPath,
  toUiPath,

  /**
   * Data Stores (Schema)
   */
  outline: toDataPath('outline.md'), // TODO: Declare as part of a "Package Data Schema".

  /**
   * UI state (transient).
   */
  Ui: {
    selection: toUiPath('selection.json'),
  },
};
