import { type t } from './common';
import { Wallet } from './ui.Wallet';

export function FieldWalletsList(
  privy: t.PrivyInterface,
  wallets: t.ConnectedWallet[],
  enabled: boolean,
): t.PropListItem[] {
  if (!privy.ready) enabled = false;

  return wallets.map((wallet, i) => {
    const key = `${i}.${wallet.address}}`;
    const value = <Wallet key={key} wallet={wallet} privy={privy} enabled={enabled} />;
    return { value };
  });
}
