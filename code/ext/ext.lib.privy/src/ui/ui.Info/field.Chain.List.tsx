import { Chain, DEFAULTS, Value, type t } from './common';
import { ChainRow } from './ui.Row.Chain';

export function chainList(args: {
  privy: t.PrivyInterface;
  data: t.InfoData;
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  fields: t.InfoField[];
}): t.PropListItem[] {
  const { privy, modifiers, fields, data } = args;
  const enabled = privy.ready ? args.enabled : false;
  if (!privy.authenticated) return [];

  let chains = data.chain?.names ?? DEFAULTS.data.chain!.names!;
  if (!fields.includes('Chain.List.Testnets')) {
    const notTestnet = (name: t.EvmChainName) => !Chain.is.testnet(name);
    chains = chains.filter(notTestnet);
  }

  const res: t.PropListItem[] = [];

  if (fields.includes('Chain.List.Title')) {
    const label = Value.plural(chains.length, 'Chain', 'Chains');
    res.push({ label, divider: false });
  }

  res.push(
    ...chains.map((chain) => {
      const value = <ChainRow data={data} chain={chain} modifiers={modifiers} enabled={enabled} />;
      return { value };
    }),
  );

  return res;
}
