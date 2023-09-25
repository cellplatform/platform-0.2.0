import { type t } from '../common.t';
export * from '../common';

const allChains: t.ChainName[] = [
  'EVM.L1.Mainnet',
  'EVM.L2.Optimism',
  'EVM.L2.Polygon',
  'EVM.L2.Arbitrum',
];

const defaultChains: t.ChainName[] = ['EVM.L1.Mainnet', 'EVM.L2.Optimism'];

/**
 * Default Values.
 */
export const DEFAULTS = {
  title: 'Chains',
  resettable: true,
  indexes: true,
  indent: 15,
  chains: {
    all: allChains,
    default: defaultChains,
  },
} as const;
