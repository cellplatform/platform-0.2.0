import { BundlePaths } from './common.mjs';
import { QueryString } from './QueryString.mjs';
import { StateBus as Bus } from './StateBus/index.mjs';

export { BundlePaths };
const { useEvents, fire } = Bus;

/**
 * UI State Manager
 */
export const State = {
  Bus,
  useEvents,
  fire,

  BundlePaths,
  QueryString,

  /**
   * TODO 🐷
   * Centralise all state tree changes here (remove from UI components)
   */

  get location___() {
    return new URL(location.href);
  },
};
