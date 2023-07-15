import { Patch, slug, type t } from './common';

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
    let _current = { ...args.initial };
    return {
      instance: { id: slug() },
      get current() {
        return _current;
      },
      change(fn) {
        const res = Patch.change<T>(_current, fn);
        _current = res.to;
        onChange?.(res);
      },
    } as const;
  },
};
