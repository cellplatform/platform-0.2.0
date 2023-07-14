import { DEFAULTS, Patch, type t } from './common';

/**
 * Simple safe/immutable memory state for a single item.
 */
export const ItemState = {
  init(): t.LabelItemState {
    let _current = DEFAULTS.data;
    return {
      get current() {
        return _current;
      },
      change(fn) {
        const res = Patch.change(_current, fn);
        _current = res.to;
      },
    };
  },
};
