import { t } from '../common.mjs';
import { QueryString } from './QueryString.mjs';

/**
 * UI State Manager
 */
export const State = {
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
