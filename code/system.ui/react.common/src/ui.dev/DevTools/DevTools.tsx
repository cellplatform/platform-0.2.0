import { R, t } from '../common';
import { button } from '../DevTools.Button';

export const DevTools = {
  curry(input: t.DevCtxInput) {
    return {
      button: R.partial(DevTools.button, [input]),
    };
  },

  /**
   * A simple clickable text button implementation.
   */
  button,
};
