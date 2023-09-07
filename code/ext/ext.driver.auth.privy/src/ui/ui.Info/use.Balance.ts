import { useEffect, useState } from 'react';
import { Wrangle } from './Wrangle';
import { Balance, type t } from './common';

export function useBalance(args: { wallet: t.ConnectedWallet; chain: t.EvmChainName }) {
  const { wallet } = args;
  const walletDeps = Wrangle.walletDeps(wallet);

  const [wei, setWei] = useState<bigint | undefined>();
  const [eth, setEth] = useState<number | undefined>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const run = async () => {
      setFetching(true);
      const res = await Balance.fetch(wallet, args.chain);
      setWei(res.wei);
      setEth(res.eth);
      setFetching(false);
    };

    run();
  }, [walletDeps, args.chain]);

  /**
   * API
   */
  return {
    is: { fetching },
    eth,
    wei,
    toString(unit: 'ETH', round: number = 4) {
      if (typeof eth === 'undefined') return '-';
      return `${eth.toFixed(round)} ETH`;
    },
  } as const;
}
