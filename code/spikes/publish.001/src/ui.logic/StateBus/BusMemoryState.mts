import { R, t } from './common.mjs';

/**
 * Helper/wrapper for managing an in-memory version of the root state tree.
 */
export function BusMemoryState() {
  let _current_: t.StateTree = {};
  let _revision_ = 0;

  return {
    get revision() {
      return _revision_;
    },
    get current() {
      return { ..._current_ };
    },
    change(fn: (draft: t.StateTree) => void) {
      /**
       * TODO 🐷
       *   Do this with either
       *    - [JsonPatch] or
       *    - [Automerge]
       */
      const clone = R.clone(_current_); // TEMP | (Potentially) SLOW 🐷
      fn(clone);
      _revision_++;
      _current_ = clone;
    },
  };
}
