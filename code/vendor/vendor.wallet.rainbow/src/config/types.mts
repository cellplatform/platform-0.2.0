import type { configure } from './Config.mjs';

export type ConfigureResponse = Awaited<ReturnType<typeof configure>>;

/**
 * Supported block-chains
 */
export type ChainName =
  | 'EVM.L1.mainnet'
  //
  | 'EVM.L2.optimism'
  | 'EVM.L2.polygon'
  | 'EVM.L2.arbitrum';
