import type * as t from '../common/types.mjs';

type Id = string;

/**
 * An event-bus pump running over WebWorkers.
 */
export type WorkerPump = t.Disposable & {
  id: Id;
  fire(event: t.Event, options?: { tx?: Id; target?: Id }): t.NetworkMessageEvent;
};
