import type { t, u } from './common';

/**
 * A fully resolved document object for a <Cmd> lens.
 */
export type CmdObject<C extends t.CmdType> = {
  queue: t.CmdQueue<C>;
  total: t.CmdTotals;
};

/**
 * Represents a queue of commands that have been invoked.
 * FIFO (first-in, first-out).
 */
export type CmdQueue<C extends t.CmdType = t.CmdType> = CmdQueueItem<C>[];
export type CmdQueueItem<C extends t.CmdType> = {
  name: C['name'];
  params: C['params'];
  tx: string;
  error?: u.ExtractError<C>;
};

/**
 * Total meta-data about a command.
 */
export type CmdTotals = {
  purged: number;
};
