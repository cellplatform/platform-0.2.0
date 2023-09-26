import type { configure } from './Config.mjs';

export type ConfigureResponse = Awaited<ReturnType<typeof configure>>;

/**
 * Supported block-chains
 */
export type ChainName =
  | 'EVM.L1.Mainnet'
  //
  | 'EVM.L2.Optimism'
  | 'EVM.L2.Polygon'
  | 'EVM.L2.Arbitrum';
