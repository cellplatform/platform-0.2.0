import { Id, DEFAULT, Is, R, rx, t } from './common';

type Revision = { number: number; message: string };

export type ChangedHandler = (e: ChangedHandlerArgs) => void;
export type ChangedHandlerArgs = { message: t.DevInfoChangeMessage; info: t.DevInfo };

/**
 * Helper/wrapper for managing an in-memory version of the root state tree.
 */
export function BusMemoryState(args: { instance: t.DevInstance; onChanged?: ChangedHandler }) {
  let _revision: Revision = { number: 0, message: 'initial' };
  let _current: t.DevInfo = DEFAULT.info();

  _current.instance.context = Id.ctx.create();
  _current.instance.bus = rx.bus.instance(args.instance.bus);

  /**
   * API
   */
  const api = {
    get revision() {
      return { ..._revision };
    },
    get current(): t.DevInfo {
      return { ..._current };
    },
    async change(message: t.DevInfoChangeMessage, fn: t.DevInfoMutater) {
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
      _current = changedByAnotherProcess ? (R.mergeDeepRight(_current, clone) as t.DevInfo) : clone;
      _revision = { number: before.number + 1, message };

      args.onChanged?.({ message, info: _current });
    },
  };

  return api;
}
