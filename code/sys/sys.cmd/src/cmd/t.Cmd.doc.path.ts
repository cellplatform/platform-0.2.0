import type { t, u } from './common';

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  queue: t.ObjectPath;

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
  queue?: t.CmdQueueItem<C>[];
  name?: C['name'];
  params?: C['params'];
  error?: u.ExtractError<C>;
  counter?: t.CmdCounter;
  tx?: string;
};
