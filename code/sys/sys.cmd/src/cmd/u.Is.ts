import type { t } from './common';

/**
 * Flags: Event pattern inference.
 */
export const Is = {
  state: {
    cmd(input: any): input is t.CmdPathsObject {
      if (!isObject(input)) return false;
      const o = input as t.CmdPathsObject;
      const q = o.queue;
      if (!Array.isArray(q)) return false;
      if (q.length > 0 && !Is.state.item(q[q.length - 1])) return false;
      return true;
    },

    item(input: any): input is t.CmdQueueItem<t.CmdType> {
      if (!isObject(input)) return false;
      const o = input as t.CmdQueueItem<t.CmdType>;
      return typeof o.name === 'string' && typeof o.params === 'object' && typeof o.tx === 'string';
    },
  },

  cmd<C extends t.CmdType>(input: t.Cmd<C> | any): input is t.Cmd<C> {
    if (!isObject(input)) return false;
    const o = input as t.Cmd<C>;
    return (
      typeof o.events === 'function' &&
      typeof o.invoke === 'function' &&
      typeof o.method === 'function'
    );
  },
} as const;

/**
 * Helpers
 */
function isObject(input: any): input is object {
  return typeof input === 'object' && input !== null;
}
