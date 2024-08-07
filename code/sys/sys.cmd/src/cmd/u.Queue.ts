import { type t } from './common';
import { Path } from './u.Path';

type PathsInput = t.CmdPaths | t.ObjectPath;

export const Queue = {
  /**
   * Collapse the queue array.
   */
  purge(transport: t.CmdTransport, options: { retain?: number; paths?: PathsInput } = {}) {
    const { retain = 0 } = options;
    const resolve = Path.resolver(options.paths);

    transport.change((d) => {
      const queue = resolve.queue.list(d);
      const deleteCount = Math.max(queue.length - retain, 0);
      resolve.total(d).purged += deleteCount;
      queue.splice(0, deleteCount);
    });

    return resolve.total(transport.current);
  },
} as const;
