import { Chain, DEFAULTS, Value, type t } from './common';
import { Chain } from './ui.Chain';

export function FieldChainList(args: {
  privy: t.PrivyInterface;
  data: t.InfoData;
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  fields: t.InfoField[];
}): t.PropListItem[] {
  const { privy, modifiers, fields, data } = args;
  const enabled = privy.ready ? args.enabled : false;

  let chains = data.chain?.names ?? DEFAULTS.data.chain!.names!;
  if (!fields.includes('Chain.List.Testnets')) {
    chains = chains.filter((name) => !Chain.isTestnet(name));
  }

  const res: t.PropListItem[] = [];

  if (fields.includes('Chain.List.Title')) {
    const label = Value.plural(chains.length, 'Chain', 'Chains');
    res.push({ label, divider: false });
  }

  res.push(
    ...chains.map((name) => {
      const chain = Chain.get(name);
      const value = <Chain name={chain.name} modifiers={modifiers} enabled={enabled} />;
      return { value };
    }),
  );

  return res;
}
