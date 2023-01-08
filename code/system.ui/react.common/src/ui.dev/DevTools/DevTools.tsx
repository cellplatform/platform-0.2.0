import { Spec, t } from '../common';
import { button } from '../DevTools.Button';
import { boolean } from '../DevTools.Boolean';
import { hr } from '../DevTools.Hr';

type O = Record<string, unknown>;

export const DevTools = {
  /**
   * Curried initializtation.
   */
  init,

  /**
   * Widgets.
   */
  button,
  boolean,
  hr,
};

/**
 * [Helpers]
 */

function init<S extends O = O>(input: t.DevCtxInput, initial?: S) {
  const state = initial ?? ({} as S);
  const ctx = Spec.ctx(input);
  const api: t.DevTools<S> = {
    ctx,

    /**
     * Widgets.
     */
    button(...args: any[]) {
      if (typeof args[0] === 'function') {
        DevTools.button<S>(ctx, state, args[0]);
      }

      if (typeof args[0] === 'string') {
        DevTools.button<S>(ctx, state, (btn) => {
          btn.label(args[0]);
          if (typeof args[1] === 'function') btn.onClick(args[1]);
        });
      }

      return api;
    },

    boolean(...args: any[]) {
      if (typeof args[0] === 'function') {
        DevTools.boolean<S>(ctx, state, args[0]);
      }

      return api;
    },

    hr() {
      DevTools.hr(ctx);
      return api;
    },
  };

  return api;
}
