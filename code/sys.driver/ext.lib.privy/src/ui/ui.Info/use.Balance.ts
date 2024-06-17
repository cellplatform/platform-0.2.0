import { useEffect, useState } from 'react';
import { Balance, rx, type t } from './common';
import { Wrangle } from './u';

export function useBalance(args: {
  wallet: t.ConnectedWallet;
  chain: t.EvmChainName;
  refresh$?: t.Observable<void>;
}) {
  const { wallet, refresh$ } = args;
  const walletDeps = Wrangle.walletDeps(wallet);

  const [wei, setWei] = useState<bigint | undefined>();
  const [eth, setEth] = useState<number | undefined>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const run = async () => {
      setFetching(true);
      const res = await Balance.fetch(wallet, args.chain);
      setWei(res.wei);
      setEth(res.eth);
      setFetching(false);
    };

    refresh$?.pipe(rx.takeUntil(dispose$)).subscribe(run);
    run();

    return dispose;
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
