import type { t } from './common';

type Tx = string;

export type CmdTxFactory = () => Tx;
export type CmdCounter = { value: number };
export type CmdCounterFactory = {
  create(initial?: number): CmdCounter;
  increment(mutate: t.CmdCounter): void;
};
