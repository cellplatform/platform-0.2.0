import { CssUtil } from './util.css';
import { toMinWidth, toWidth } from './util.size';
import { ValueUtil as value } from './util.value';

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
