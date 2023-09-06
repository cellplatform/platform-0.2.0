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
  'Eth:main',
  'Eth:test:goerli',
  'Eth:test:sepolia',
  'Op:main',
  'Op:test:goerli',
  'Base:main',
  'Base:test:goerli',
  'Zora:main',
  'Zora:test',
];

export const Chains = {
  names,

  /**
   * Retrieve the named chain.
   */
  get(name: t.EvmChainName) {
    if (name === 'Eth:main') return mainnet;
    if (name === 'Eth:test:goerli') return goerli;
    if (name === 'Eth:test:sepolia') return sepolia;

    if (name === 'Op:main') return optimism;
    if (name === 'Op:test:goerli') return optimismGoerli;

    if (name === 'Base:main') return base;
    if (name === 'Base:test:goerli') return baseGoerli;

    if (name === 'Zora:main') return zora;
    if (name === 'Zora:test') return zoraTestnet;

    throw new Error(`Chain named '${name}' not supported.`);
  },

  isTestnet(name: t.EvmChainName) {
    return name.includes(':test');
  },
} as const;
