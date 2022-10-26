import { QueryString } from './QueryString.mjs';
import { t, BundlePaths } from './common.mjs';
export { BundlePaths };

/**
 * UI State Manager
 */
export const State = {
  BundlePaths,
  QueryString,

  //
  /**
   * TODO 🐷
   * Centralise all state tree changes here (remove from UI components)
   */

  get location() {
    return new URL(location.href);
  },
};
