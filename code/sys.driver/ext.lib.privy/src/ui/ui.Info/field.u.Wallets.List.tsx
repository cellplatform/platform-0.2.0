import { Value, type t } from './common';

import { Wrangle } from './u';
import { WalletRow } from './ui.Row.Wallet';

type Args = t.InfoFieldArgs & {
  wallets: t.ConnectedWallet[];
  refresh$?: t.Observable<void>;
};

export function walletsList(args: Args): t.PropListItem[] {
  const { privy, wallets, modifiers, fields, data, refresh$, theme } = args;
  const enabled = privy.ready ? args.enabled : false;
  const showClose = modifiers.is.over && modifiers.keys.alt;
  const chain = Wrangle.chain(data);

  const res: t.PropListItem[] = [];
  if (!privy.authenticated) return res;

  if (fields.includes('Wallet.List.Title')) {
    const label = data.wallet?.list?.label ?? Value.plural(wallets.length, 'Wallet', 'Wallets');
    res.push({ label, divider: false });
  }

  res.push(
    ...wallets.map((wallet, i) => {
      const value = (
        <WalletRow
          key={`${i}.${wallet.address}}`}
          wallet={wallet}
          privy={privy}
          chain={chain}
          enabled={enabled}
          showClose={showClose}
          refresh$={refresh$}
          theme={theme}
        />
      );
      return { value };
    }),
  );

  return res;
}
