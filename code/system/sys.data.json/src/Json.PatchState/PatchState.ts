import { Patch, rx, slug, type t } from './common';
import { defaultEvents } from './PatchState.events';
import { Is } from './PatchState.Is';

type O = Record<string, unknown>;
type Args<T extends O, E> = {
  initial: T;
  events?: t.PatchStateEventFactory<T, E>;
  onChange?: t.PatchChangeHandler<T>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const PatchState = {
  Is,

  /**
   * Initialize a new <PathState> object.
   */
  init<T extends O, E = t.PatchStateEvents<T>>(args: Args<T, E>): t.PatchState<T, E> {
    const { onChange } = args;
    const $ = rx.subject<t.PatchChange<T>>();
    let _current = { ...args.initial };
    return {
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
        _current = e.to;
        onChange?.(e);
        $.next(e);
      },

      /**
       * Observable listener.
       */
      events(dispose$?: t.UntilObservable) {
        const factory = args.events ?? defaultEvents;
        return factory($, dispose$) as E;
      },
    } as const;
  },
} as const;
