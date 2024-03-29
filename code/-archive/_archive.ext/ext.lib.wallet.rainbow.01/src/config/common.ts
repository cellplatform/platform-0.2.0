import { type t } from '../common';
export * from '../common';

export const ChainNameMapping = {
  mapping: [
    ['EVM.L1.Mainnet', 'Ethereum'],
    ['EVM.L2.Optimism', 'OP Mainnet'],
    ['EVM.L2.Polygon', 'Polygon'],
    ['EVM.L2.Arbitrum', 'Arbitrum One'],
  ] as [t.ChainName, string][],

  find(chains: t.WagmiChain[], name: t.ChainName) {
    const notFound = () => new Error(`Chain '${name}' not found.`);
    const mapping = ChainNameMapping.mapping.find((item) => item[0] === name);
    if (!mapping) throw notFound();

    const chain = chains.find((chain) => chain.name === mapping[1]);
    if (!chain) throw notFound();
    return chain;
  },

  mainnet(chains: t.WagmiChain[]) {
    return ChainNameMapping.find(chains, 'EVM.L1.Mainnet')!;
  },

  filterAndOrder(chains: t.WagmiChain[], names: t.ChainName[], defaultChain?: t.ChainName) {
    const list = names.map((name) => ChainNameMapping.find(chains, name)!).filter(Boolean);
    if (list.length === 0 && defaultChain) {
      return [ChainNameMapping.find(chains, defaultChain)!].filter(Boolean);
    } else {
      return list;
    }
  },
};
