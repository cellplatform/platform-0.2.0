import { type t } from './common';
import { Wallet } from './ui.Wallet';

export function FieldWalletsList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  enabled: boolean;
  modifiers: t.KeyboardModifierFlags;
  isOver: boolean;
}): t.PropListItem[] {
  const { privy, wallets } = args;
  const enabled = privy.ready ? args.enabled : false;
  const showClose = args.isOver && args.modifiers.alt;

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
