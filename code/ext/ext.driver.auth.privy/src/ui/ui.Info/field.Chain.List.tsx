import { DEFAULTS, Value, type t } from './common';

export function FieldChainList(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  data: t.InfoData;
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  fields: t.InfoField[];
}): t.PropListItem[] {
  const { privy, wallets, modifiers, fields, data } = args;
  const enabled = privy.ready ? args.enabled : false;
  const chains = data.chains?.list ?? DEFAULTS.data.chains!.list!;

  const res: t.PropListItem[] = [];

  if (fields.includes('Chain.List.Title')) {
    const label = Value.plural(chains.length, 'Chain', 'Chains');
    res.push({ label, divider: false });
  }

  return res;
}
