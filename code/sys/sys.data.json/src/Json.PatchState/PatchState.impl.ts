import { Delete, Patch, rx, slug, Value, type t } from './common';
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
    change(fn, opt) {
      const e = Patch.change<T>(_current, fn);
      _current = e.after;
      options.onChange?.(e);
      const callback = wrangle.callback(opt);
      if (callback) {
        const patches = e.patches.next.map((op) => wrangle.asPatch(op));
        callback(patches);
      }
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

/**
 * Helpers
 */
const wrangle = {
  asAction(op: t.PatchOperation['op']): t.Patch['action'] {
    if (op === 'add') return 'insert';
    if (op === 'remove') return 'del';
    if (op === 'replace') return 'put';
    throw new Error(`op '${op}' not supported`);
  },

  asPatch(op: t.PatchOperation): t.Patch {
    const action = wrangle.asAction(op.op);
    const path = op.path
      .split('/')
      .filter(Boolean)
      .map((v) => Value.toType(v));
    const value = (op as any).value;
    return Delete.undefined({ action, path, value }) as t.Patch;
  },

  callback(options?: t.ImmutableChangeOptions) {
    if (!options) return;
    if (typeof options === 'function') return options;
    if (typeof options.patches === 'function') return options.patches;
    return;
  },
} as const;
