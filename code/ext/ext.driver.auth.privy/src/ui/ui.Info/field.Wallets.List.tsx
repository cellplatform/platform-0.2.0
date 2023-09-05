import { Value, type t } from './common';
import { Wallet } from './ui.Wallet';

export function FieldWalletsList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  fields: t.InfoField[];
}): t.PropListItem[] {
  const { privy, wallets, modifiers, fields } = args;
  const enabled = privy.ready ? args.enabled : false;
  const showClose = modifiers.is.over && modifiers.keys.alt;

  const res: t.PropListItem[] = [];

  if (fields.includes('Wallet.List.Title')) {
    const label = Value.plural(wallets.length, 'Wallet', 'Wallets');
    res.push({ label, divider: false });
  }

  res.push(
    ...wallets.map((wallet, i) => {
      const value = (
        <Wallet
          key={`${i}.${wallet.address}}`}
          wallet={wallet}
          privy={privy}
          enabled={enabled}
          showClose={showClose}
        />
      );
      return { value };
    }),
  );

  return res;
}
