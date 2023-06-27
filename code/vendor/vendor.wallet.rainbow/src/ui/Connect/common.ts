import { type t } from '../common.t';
export * from '../common';

const allChains: t.ChainName[] = [
  'EVM.L1.mainnet',
  'EVM.L2.optimism',
  'EVM.L2.polygon',
  'EVM.L2.arbitrum',
];
const defaultChains: t.ChainName[] = ['EVM.L1.mainnet', 'EVM.L2.optimism'];

/**
 * Default Values.
 */
export const DEFAULTS = {
  autoload: true,
  chains: {
    all: allChains,
    default: defaultChains,
  },
  minSize: {
    minWidth: 146, // NB: The initial connect-button width.
    minHeight: 40,
  },
} as const;
