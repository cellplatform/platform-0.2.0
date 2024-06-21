import type { t, u } from './common';

type Tx = string;

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  name: t.ObjectPath;
  params: t.ObjectPath;
  error: t.ObjectPath;
  counter: t.ObjectPath;
  tx: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdPathsObject<C extends t.CmdType = t.CmdType> = {
  name?: C['name'];
  params?: C['params'];
  error?: u.ExtractError<C>;
  counter?: CmdCounter;
  tx?: string;
};

export type CmdTxFactory = () => Tx;

export type CmdCounter = { value: number };
export type CmdCounterFactory = {
  create(initial?: number): CmdCounter;
  increment(mutate: t.CmdCounter): void;
};

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdObject<C extends t.CmdType> = {
  name: C['name'];
  params: C['params'];
  error?: u.ExtractError<C>;
  count: number;
  tx: string;
};