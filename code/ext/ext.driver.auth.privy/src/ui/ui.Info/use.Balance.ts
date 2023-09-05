import { useEffect, useState } from 'react';
import { createPublicClient, createWalletClient, custom, formatEther, type Address } from 'viem';
import { optimism } from 'viem/chains';

import { Wrangle } from './Wrangle';
import { type t } from './common';

export function useBalance(wallet: t.ConnectedWallet) {
  const walletDeps = Wrangle.walletDeps(wallet);
  const [eth, setEth] = useState(-1);

  useEffect(() => {
    fetchBalance(wallet).then((res) => {
      setEth(res.eth);
    });
  }, [walletDeps]);

  /**
   * API
   */
  return {
    eth,
    toString(unit: 'ETH', round: number = 4) {
      return eth < 0 ? '-' : `${eth.toFixed(round)} ETH`;
    },
  } as const;
}

/**
 * Look up the balance
 */
async function fetchBalance(wallet: t.ConnectedWallet) {
  // https://chainlist.org
  // Optimism → 10.
  const chainId = `0x${Number(10).toString(16)}`;

  const ethereumProvider = await wallet.getEthereumProvider();
  ethereumProvider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  });
  const transport = custom(ethereumProvider);

  // const chain = mainnet;
  const chain = optimism;
  const address = wallet.address as Address;

  const walletClient = createWalletClient({ account: address, chain, transport });
  const publicClient = createPublicClient({ chain, transport });
  // const publicClient = createPublicClient(transport, chain);

  const wei = await publicClient.getBalance({ address });
  const eth = Number.parseFloat(formatEther(wei));

  const m = await convertEthToUsd(eth);
  console.log('m', m);

  return { wei, eth } as const;
}

const getFiatConversion = async () => {
  //
  const url = `https://api.exchangerate.host/convert?from=ETH&to=USD`;
  const res = await fetch(url);
  const json = await res.json();

  console.log('res', res);
  console.log('json', json);
  // const res =
};

async function convertEthToUsd(amount: number): Promise<number | null> {
  const url = 'https://api.exchangerate.host/latest?symbols=USD&base=ETH';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const ethToUsdRate = data.rates.USD;
    return amount * ethToUsdRate;
  } catch (error: any) {
    console.error('Error fetching exchange rate:', error.message);
    return null;
  }
}
