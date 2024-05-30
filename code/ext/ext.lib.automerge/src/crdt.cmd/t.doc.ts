import type { t } from './common';

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  name: t.ObjectPath;
  params: t.ObjectPath;
  counter: t.ObjectPath;
  tx: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdPathsObject<C extends t.CmdType = t.CmdType> = {
  name?: C['name'];
  params?: C['params'];
  counter?: CmdCounter;
  tx?: string;
};
export type CmdCounter = { readonly value: number };

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdObject<C extends t.CmdType> = {
  name: C['name'];
  params: C['params'];
  count: number;
  tx: string;
};
