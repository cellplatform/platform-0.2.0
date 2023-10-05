import { Value, type t } from './common';
import { WalletRow } from './ui.Row.Wallet';
import { Wrangle } from './Wrangle';

export function FieldWalletsList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  data: t.InfoData;
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  fields: t.InfoField[];
}): t.PropListItem[] {
  const { privy, wallets, modifiers, fields, data } = args;
  const enabled = privy.ready ? args.enabled : false;
  const showClose = modifiers.is.over && modifiers.keys.alt;
  const chain = Wrangle.chain(data);

  const res: t.PropListItem[] = [];

  if (fields.includes('Wallet.List.Title')) {
    const label = Value.plural(wallets.length, 'Wallet', 'Wallets');
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
        />
      );
      return { value };
    }),
  );

  return res;
}
