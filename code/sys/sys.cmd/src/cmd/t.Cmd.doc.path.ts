import type { t } from './common';

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  queue: t.ObjectPath;
  total: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdPathsObject<C extends t.CmdType = t.CmdType> = {
  queue?: t.CmdQueueItem<C>[];
  total?: t.CmdTotals;
};
