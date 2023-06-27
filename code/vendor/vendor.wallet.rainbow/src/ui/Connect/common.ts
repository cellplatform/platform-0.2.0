import { type t } from '../common.t';
export * from '../common';

import { DEFAULTS as SELECTOR_DEFAULTS } from '../ChainSelector/common';

/**
 * Default Values.
 */
export const DEFAULTS = {
  autoload: true,
  chains: SELECTOR_DEFAULTS.chains,
  minSize: {
    minWidth: 146, // NB: The initial connect-button width.
    minHeight: 40,
  },
} as const;
