import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
  zora,
  zoraTestnet,
} from 'viem/chains';
import { type t } from '../common';

const names: t.EvmChainName[] = [
  'Eth:Main',
  'Eth:Test:Goerli',
  'Eth:Test:Sepolia',
  'Op:Main',
  'Op:Test:Goerli',
  'Base:Main',
  'Base:Test:Goerli',
  'Zora:Main',
  'Zora:Test',
];

export const Chain = {
  names,

  displayName(name: t.EvmChainName) {
    const chain = Chain.get(name);

    if (name === 'Eth:Test:Goerli') return 'Ethereum (Goerli)';
    if (name === 'Eth:Test:Sepolia') return 'Ethereum (Sepolia)';
    if (name === 'Op:Main') return 'Optimism';
    if (name === 'Op:Test:Goerli') return 'Optimism (Goerli)';
    if (name === 'Base:Test:Goerli') return 'Base (Goerli)';
    if (name === 'Zora:Test') return 'Base (Test)';

    return chain.name;
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
    if (name === 'Zora:Main') return zora;
    if (name === 'Zora:Test') return zoraTestnet;
    throw new Error(`Chain named '${name}' not supported.`);
  },

  isTestnet(name: t.EvmChainName) {
    return name.includes(':Test');
  },
} as const;
