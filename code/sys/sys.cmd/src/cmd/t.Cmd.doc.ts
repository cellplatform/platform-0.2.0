import type { t } from './common';

/**
 * A fully resolved document object for a <Cmd> lens.
 */
export type CmdObject<C extends t.CmdType> = {
  queue: t.CmdQueue<C>;
  total: t.CmdTotals;
};

/**
 * Total meta-data about a command.
 */
export type CmdTotals = {
  purged: number;
};
