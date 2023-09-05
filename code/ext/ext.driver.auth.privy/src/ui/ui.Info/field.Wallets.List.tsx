import { type t } from './common';
import { Wallet } from './ui.Wallet';

export function FieldWalletsList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
}): t.PropListItem[] {
  const { privy, wallets, modifiers } = args;
  const enabled = privy.ready ? args.enabled : false;
  const showClose = modifiers.is.over && modifiers.keys.alt;

  return wallets.map((wallet, i) => {
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
  });
}
