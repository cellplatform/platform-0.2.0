import { DEFAULTS, rx, type t } from './common';
import { Path } from './u.Path';
import { toTransport, toPaths } from './u.To';

type PathsInput = t.CmdPaths | t.ObjectPath;
type MonitorOptions = {
  min?: number;
  max?: number;
  dispose$?: t.UntilObservable;
};

export const Queue = {
  /**
   * Collapse the queue array.
   */
  purge(doc: t.CmdTransport, options: { min?: number; paths?: PathsInput } = {}) {
    const { min = 0 } = options;
    const resolve = Path.resolver(options.paths);

    doc.change((d) => {
      const queue = resolve.queue.list(d);
      const deleteCount = Math.max(queue.length - min, 0);
      resolve.total(d).purged += deleteCount;
      queue.splice(0, deleteCount);
    });

    return resolve.total(doc.current).purged;
  },

  /**
   * Derive the queue totals from the given transport.
   */
  totals<C extends t.CmdType>(cmd: t.Cmd<C>): t.CmdQueueTotals {
    const doc = toTransport(cmd);
    const paths = toPaths(cmd);
    const resolve = Path.resolver(paths);
    const list = resolve.queue.list(doc.current);
    const purged = resolve.total(doc.current).purged;
    const current = list.length;
    const complete = current + purged;
    return { current, purged, complete };
  },

  /**
   * Start a queue monitor.
   * (manages auto-purging)
   */
  monitor<C extends t.CmdType>(cmd: t.Cmd<C>, options: MonitorOptions = {}): t.CmdQueueMonitor {
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
      purged += Queue.purge(doc, { min, paths });
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

  /**
   * Method for setting up a queue/purge monitor for the given command.
   */
  autopurge<C extends t.CmdType>(cmd: t.Cmd<C>, options: MonitorOptions) {
    return Queue.monitor(cmd, options);
  },
} as const;
