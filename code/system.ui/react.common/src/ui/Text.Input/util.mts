import { CssUtil } from './util.css.mjs';
import { toMinWidth, toWidth } from './util.size.mjs';
import { ValueUtil as value } from './util.value.mjs';

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
