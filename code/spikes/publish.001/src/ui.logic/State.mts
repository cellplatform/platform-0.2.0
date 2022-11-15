import { BundlePaths } from './common';
import { StateBus as Bus } from './StateBus/index.mjs';

export { BundlePaths };
const { useEvents, withEvents } = Bus;

/**
 * UI State Manager
 */
export const State = {
  BundlePaths,
  Bus,
  withEvents,
  useEvents,
};
