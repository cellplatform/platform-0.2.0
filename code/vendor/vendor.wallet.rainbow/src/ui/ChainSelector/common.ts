export * from '../common';

import { DEFAULTS as BASE_DEFAULTS } from '../Connect/common';

/**
 * Default Values.
 */
export const DEFAULTS = {
  title: 'Chains',
  chains: BASE_DEFAULTS.chains,
  resettable: true,
} as const;
