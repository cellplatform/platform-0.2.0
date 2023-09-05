import { type t } from './common';
import { Wallet } from './ui.Wallet';

export function FieldChainList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
}): t.PropListItem[] {
  const { privy, wallets, modifiers } = args;
  const enabled = privy.ready ? args.enabled : false;

  return [
    {
      label: 'Chains 🐷',
      value: '🐷',
    },
  ];
}
