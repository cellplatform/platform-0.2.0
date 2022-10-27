import { QueryString } from './QueryString.mjs';
import { t, BundlePaths } from './common.mjs';
export { BundlePaths };
import { StateBus as Bus } from './StateBus/index.mjs';

/**
 * UI State Manager
 */
export const State = {
  Bus,
  BundlePaths,
  QueryString,

  //
  /**
   * TODO 🐷
   * Centralise all state tree changes here (remove from UI components)
   */

  get location___() {
    return new URL(location.href);
  },
};
