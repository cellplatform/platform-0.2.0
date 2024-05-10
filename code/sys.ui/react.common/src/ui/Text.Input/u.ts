import { CssUtil } from './u.css';
import { toMinWidth, toWidth } from './u.size';
import { Value } from './u.value';

/**
 * Helpers
 */
export const Util = {
  Value,
  Css: {
    ...CssUtil,
    toWidth,
    toMinWidth,
  },
} as const;

export const Wrangle = {
  selection(el?: HTMLInputElement | null) {
    const start = el?.selectionStart ?? -1;
    const end = el?.selectionEnd ?? -1;
    return { start, end };
  },
} as const;
