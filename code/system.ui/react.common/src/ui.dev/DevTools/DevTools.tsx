import { t, Spec } from '../common';
import { button } from '../DevTools.Button';
import { hr } from '../DevTools.Hr';

import type { DevButtonHandler } from '../DevTools.Button/types.mjs';

type O = Record<string, unknown>;

export const DevTools = {
  /**
   * Curried initializtation.
   */
  init: curried,

  /**
   * Widgets
   */
  button,
  hr,
};

/**
 * [Helpers]
 */

function curried<S extends O = O>(input: t.DevCtxInput, initial?: S) {
  const state = initial ?? ({} as S);
  const ctx = Spec.ctx(input);
  const api = {
    ctx,

    /**
     * Widgets.
     */
    button(fn: DevButtonHandler<S>) {
      DevTools.button<S>(ctx, state, fn);
      return api;
    },

    hr() {
      DevTools.hr(ctx);
      return api;
    },
  };

  return api;
}
