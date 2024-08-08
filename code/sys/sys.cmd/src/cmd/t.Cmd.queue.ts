import type { t, u } from './common';

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
 * A queue monitor that manages auto-purging.
 */
export type CmdQueueMonitor = t.Lifecycle & {
  readonly bounds: CmdQueueBounds;
  readonly total: CmdQueueTotals;
};

export type CmdQueueBounds = {
  readonly max: number; // Triggers purge at this value.
  readonly min: number; // Purges to no less than this value.
};

export type CmdQueueTotals = {
  readonly current: number;
  readonly purged: number;
  readonly complete: number;
};
