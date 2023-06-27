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
  title: 'Chains',
  resettable: true,
  showIndexes: true,
  indent: 15,
  chains: {
    all: allChains,
    default: defaultChains,
  },
} as const;
