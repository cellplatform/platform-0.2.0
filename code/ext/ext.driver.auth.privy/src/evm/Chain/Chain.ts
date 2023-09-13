import { custom } from 'viem';
import { base, baseGoerli, goerli, mainnet, optimism, optimismGoerli, sepolia } from 'viem/chains';
import { type t } from '../common';

const names: t.EvmChainName[] = [
  'Eth:Main',
  'Eth:Test:Goerli',
  'Eth:Test:Sepolia',
  'Op:Main',
  'Op:Test:Goerli',
  'Base:Main',
  'Base:Test:Goerli',
];

export const Chain = {
  names,

  is: {
    testnet(name: t.EvmChainName) {
      return name.includes(':Test');
    },
  },

  /**
   * Retrieve the named chain.
   */
  get(name: t.EvmChainName) {
    if (name === 'Eth:Main') return mainnet;
    if (name === 'Eth:Test:Goerli') return goerli;
    if (name === 'Eth:Test:Sepolia') return sepolia;
    if (name === 'Op:Main') return optimism;
    if (name === 'Op:Test:Goerli') return optimismGoerli;
    if (name === 'Base:Main') return base;
    if (name === 'Base:Test:Goerli') return baseGoerli;
    throw new Error(`Chain named '${name}' not supported.`);
  },

  displayName(name: t.EvmChainName) {
    const chain = Chain.get(name);

    if (name === 'Eth:Main') return 'Ethereum (L1)';
    if (name === 'Eth:Test:Goerli') return 'Ethereum (Goerli)';
    if (name === 'Eth:Test:Sepolia') return 'Ethereum (Sepolia)';
    if (name === 'Op:Main') return 'Optimism';
    if (name === 'Op:Test:Goerli') return 'Optimism (Goerli)';
    if (name === 'Base:Test:Goerli') return 'Base (Goerli)';

    return chain.name;
  },

  identifier(name: t.EvmChainName) {
    const chain = Chain.get(name);
    const id = chain.id;
    const hex = `0x${Number(id).toString(16)}`;
    return { id, hex } as const;
  },

  async provider(wallet: t.ConnectedWallet, name: t.EvmChainName) {
    const chain = Chain.get(name);
    const chainId = Chain.identifier(name).hex;

    const eip1193 = await wallet.getEthereumProvider();
    eip1193.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
    const transport = custom(eip1193);

    return { name, chain, transport, eip1193 } as const;
  },
} as const;
