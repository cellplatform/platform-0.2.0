import { DEFAULTS, rx, type t, ObjectPath } from './common';
import { Path } from './u.Path';
import { toTransport, toPaths } from './u.To';

type MonitorOptions = {
  min?: number;
  max?: number;
  dispose$?: t.UntilObservable;
};

export const Queue = {
  /**
   * Collapse the queue array.
   */
  purge<C extends t.CmdType>(cmd: t.Cmd<C>, options: { min?: number } = {}) {
    const { min = DEFAULTS.queue.bounds.min } = options;
    const doc = toTransport(cmd);
    const paths = toPaths(cmd);
    const resolve = Path.resolver(paths);

    doc.change((d) => {
      const queue = resolve.queue.list(d);
      const deleteCount = Math.max(queue.length - min, 0);
      ObjectPath.Mutate.ensure(d, paths.log, DEFAULTS.log());
      resolve.log(d).total.purged += deleteCount;
      queue.splice(0, deleteCount);
    });

    return resolve.log(doc.current).total?.purged;
  },

  /**
   * Derive the queue totals from the given transport.
   */
  totals<C extends t.CmdType>(cmd: t.Cmd<C>): t.CmdQueueTotals {
    const doc = toTransport(cmd);
    const paths = toPaths(cmd);
    const resolve = Path.resolver(paths);
    const list = resolve.queue.list(doc.current);
    const purged = resolve.log(doc.current).total.purged;
    const current = list.length;
    const complete = current + purged;
    return { current, purged, complete };
  },

  /**
   * Start a queue/purge monitor for the given command.
   */
  autopurge<C extends t.CmdType>(cmd: t.Cmd<C>, options: MonitorOptions = {}): t.CmdQueueMonitor {
    const BOUNDS = DEFAULTS.queue.bounds;
    const { min = BOUNDS.min, max = BOUNDS.max } = options;

    let purged = 0;
    const events = cmd.events(options.dispose$);
    const { dispose, dispose$ } = events;

    const doc = toTransport(cmd);
    const paths = toPaths(cmd);
    const resolve = Path.resolver(paths);

    /**
     * Current state.
     */
    const queue = {
      get total() {
        return queue.list.length;
      },
      get list() {
        return resolve.queue.list(doc.current);
      },
    } as const;

    /**
     * Purge when queue exceeds max bounds.
     */
    events.tx$.pipe(rx.filter((e) => queue.total >= max)).subscribe((e) => {
      purged += Queue.purge(cmd, { min });
    });

    /**
     * API
     */
    const api: t.CmdQueueMonitor = {
      bounds: { min, max },
      get total() {
        return Queue.totals(cmd);
      },

      // Lifecycle.
      dispose,
      dispose$,
      get disposed() {
        return events.disposed;
      },
    };
    return api;
  },
} as const;
