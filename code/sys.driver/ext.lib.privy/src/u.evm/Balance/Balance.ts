import { createPublicClient, formatEther, type Address } from 'viem';
import { Chain } from '../Chain';
import { type t } from '../common';

/**
 * Helpers for working with wallet balances.
 */
export const Balance = {
  /**
   * Retrieve the current balance of the given wallet address.
   */
  async fetch(wallet: t.ConnectedWallet, chainName: t.EvmChainName = 'Eth:Main') {
    const { chain, transport } = await Chain.provider(wallet, chainName);
    const publicClient = createPublicClient({ chain, transport });

    const address = wallet.address as Address;
    const wei = await publicClient.getBalance({ address });
    const eth = Number.parseFloat(formatEther(wei));

    return {
      wei,
      eth,
      toString: () => formatEther(wei),
    } as const;
  },
} as const;
