import { CssUtil } from './u.css';
import { toMinWidth, toWidth } from './u.size';
import { ValueUtil as value } from './u.value';

/**
 * Helpers
 */
export const Util = {
  value,
  css: {
    ...CssUtil,
    toWidth,
    toMinWidth,
  },
};
