import type { t } from '../common.t';

export * from '../common';

/**
 * Defaults
 */
const STATE: t.KeyboardState = {
  last: undefined,
  current: {
    modified: false,
    modifierKeys: { shift: [], ctrl: [], alt: [], meta: [] },
    modifiers: { shift: false, ctrl: false, alt: false, meta: false },
    pressed: [],
  },
};

export const DEFAULT = { STATE };
