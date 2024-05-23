import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  tx: t.ObjectPath;
  params: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdLens<P extends O = O> = {
  tx?: string;
  params?: P;
};

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdLensObject<P extends O = O> = Required<CmdLens<P>>;
