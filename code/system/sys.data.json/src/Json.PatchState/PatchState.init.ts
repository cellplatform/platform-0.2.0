import { Patch, rx, slug, type t } from './common';
import { defaultEvents } from './PatchState.events';

type O = Record<string, unknown>;
type Args<T extends O, E> = {
  initial: T;
  type?: string;
  events?: t.PatchStateEventFactory<T, E>;
  onChange?: t.PatchChangeHandler<T>;
};

/**
 * Initialize a new [PatchState] object.
 */
export function init<T extends O, E = t.PatchStateEvents<T>>(args: Args<T, E>): t.PatchState<T, E> {
  const $ = rx.subject<t.PatchChange<T>>();
  let _current = { ...args.initial };
  const state: t.PatchState<T, E> = {
    /**
     * Unique instance identifier.
     * NB: This does not pertain to the data itself, rather
     *     is an instance identifier that can be used for
     *     cheap object instance comparison (eg. in hooks).
     */
    instance: slug(),
    // type: args.type,

    /**
     * Current state.
     */
    get current() {
      return _current;
    },

    /**
     * Immutable mutator.
     */
    change(fn) {
      const e = Patch.change<T>(_current, fn);
      _current = e.to;
      args.onChange?.(e);
      $.next(e);
    },

    /**
     * Observable event listener with controllable lifetime.
     */
    events(dispose$?: t.UntilObservable) {
      const factory = args.events ?? defaultEvents;
      return factory($, dispose$) as E;
    },
  };

  if (args.type) state.type = args.type;
  return state;
}
