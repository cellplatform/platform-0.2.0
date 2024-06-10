import { Patch, rx, slug, type t } from './common';
import { defaultEvents } from './PatchState.events';

type O = Record<string, unknown>;

/**
 * Initialize a new [PatchState] object.
 */
export function create<T extends O, E = t.PatchStateEvents<T>>(
  initial: T,
  options: {
    typename?: string;
    events?: t.PatchStateEventFactory<T, E>;
    onChange?: t.PatchChangeHandler<T>;
  } = {},
): t.PatchState<T, E> {
  const $ = rx.subject<t.PatchChange<T>>();
  let _current = { ...initial };
  const state: t.PatchState<T, E> = {
    /**
     * Unique instance identifier.
     * NB: This does not pertain to the data itself, rather
     *     is an instance identifier that can be used for
     *     cheap object instance comparison (eg. in hooks).
     */
    instance: slug(),

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
      _current = e.after;
      options.onChange?.(e);
      $.next(e);
    },

    /**
     * Observable event listener with controllable lifetime.
     */
    events(dispose$?: t.UntilObservable) {
      const factory = options.events ?? defaultEvents;
      return factory($, dispose$) as E;
    },
  };

  if (options.typename) (state as any).typename = options.typename;
  return state;
}
