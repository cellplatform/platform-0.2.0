import { DEFAULTS, Patch, type t, slug } from './common';

type Options = {
  initial?: t.LabelItemData;
  onChange?: (e: t.PatchChange<t.LabelItemData>) => void;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const StateObject = {
  init(options: Options = {}): t.LabelItemState {
    const { onChange } = options;
    let _current = options.initial ?? DEFAULTS.data;
    return {
      instance: { id: slug() },
      get current() {
        return _current;
      },
      change(fn) {
        const res = Patch.change(_current, fn);
        _current = res.to;
        onChange?.(res);
      },
    };
  },
};
