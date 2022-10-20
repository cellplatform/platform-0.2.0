import { t } from '../common.mjs';
import { QueryString } from './QueryString.mjs';
import { BundlePaths } from '../../Pkg.Content.Bundle/Paths.mjs';

/**
 * UI State Manager
 */
export const State = {
  QueryString,
  BundlePaths,

  //
  /**
   * TODO 🐷
   * Centralise all state tree changes here (remove from UI components)
   */

  get location() {
    return new URL(location.href);
  },
};
