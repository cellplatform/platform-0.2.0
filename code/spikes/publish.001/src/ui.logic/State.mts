import { BundlePaths } from './common.mjs';
import { StateBus as Bus } from './StateBus/index.mjs';

export { BundlePaths };
const { useEvents, events } = Bus;

/**
 * UI State Manager
 */
export const State = {
  BundlePaths,

  Bus,
  events,
  useEvents,
};
