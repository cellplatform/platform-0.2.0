import { R, t, Is, DEFAULTS } from './common.mjs';

type UrlString = string;
type Revision = { number: number; message: string };

/**
 * Helper/wrapper for managing an in-memory version of the root state tree.
 */
export function BusMemoryState(initial: { location?: UrlString; env?: t.StateEnvironment } = {}) {
  let _revision: Revision = { number: 0, message: 'initial' };
  let _current: t.StateTree = DEFAULTS.state;

  /**
   * Initial settings.
   */
  if (initial.location) _current.location = { url: initial.location };
  if (initial.env) _current.env = initial.env;

  /**
   * API
   */
  const api = {
    get revision() {
      return { ..._revision };
    },
    get current() {
      return { ..._current };
    },
    async change(message: string, fn: t.StateMutateHandler) {
      /**
       * TODO 🐷
       *   Do this with either
       *    - [JsonPatch] or
       *    - [Automerge]
       */
      const before = api.revision;
      const clone = R.clone(_current); // TEMP | SLOW (potentially too slow)  🐷

      const res = fn(clone);
      if (Is.promise(res)) await res;

      // NB: Merging here is a "poor man's CRDT" strategy (use Automerge).
      const changedByAnotherProcess = before.number !== _revision.number;
      _current = changedByAnotherProcess
        ? (R.mergeDeepRight(_current, clone) as t.StateTree)
        : clone;

      _revision = { number: before.number + 1, message };
    },
  };

  return api;
}
