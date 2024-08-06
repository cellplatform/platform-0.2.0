import type { t, u } from './common';

/**
 * A fully resolved document object for a <Cmd> lens.
 */
export type CmdObject<C extends t.CmdType> = {
  queue: t.CmdQueueItem<C>[];

  /**
   * TODO 🐷
   */
  name: C['name'];
  params: C['params'];
  count: number;
  tx: string;
  error?: u.ExtractError<C>;
};

export type CmdQueueItem<C extends t.CmdType> = {
  name: C['name'];
  params: C['params'];
  tx: string;
  error?: u.ExtractError<C>;
};
