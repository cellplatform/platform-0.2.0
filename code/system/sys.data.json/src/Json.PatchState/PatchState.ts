import { Patch, rx, slug, type t } from './common';

type O = Record<string, unknown>;
type Args<T extends O = {}> = {
  initial: T;
  onChange?: t.PatchChangeHandler<T>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const PatchState = {
  init<T extends O>(args: Args<T>): t.PatchState<T> {
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
      events(dispose$?: t.Observable<any>) {
        const life = rx.lifecycle(dispose$);
        return {
          $: $.pipe(rx.takeUntil(life.dispose$)),
          dispose: life.dispose,
          dispose$: life.dispose$,
          get disposed() {
            return life.disposed;
          },
        };
      },
    } as const;
  },
};
