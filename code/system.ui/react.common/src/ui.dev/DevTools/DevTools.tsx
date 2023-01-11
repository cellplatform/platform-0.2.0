import { Spec, t, Dev } from '../common';
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

function init<S extends O = O>(input: t.DevCtxInput, initialState?: S) {
  const initial = initialState ?? ({} as S);
  const ctx = Spec.ctx(input);
  const debug = ctx.debug;
  const events = Dev.Bus.events(input);
  let _state: t.DevCtxState<S> | undefined;

  const api: t.DevTools<S> = {
    ctx,
    header: debug.header,
    footer: debug.footer,
    async change(fn) {
      const state = _state || (_state = await ctx.state(initial));
      return state.change(fn);
    },

    /**
     * Widgets: Argument Wrangling.
     */
    button(...args: any[]) {
      if (typeof args[0] === 'function') {
        DevTools.button<S>(events, ctx, initial, args[0]);
      }

      if (typeof args[0] === 'string') {
        DevTools.button<S>(events, ctx, initial, (btn) => {
          btn.label(args[0]);
          if (typeof args[1] === 'function') btn.onClick(args[1]);
        });
      }

      return api;
    },

    boolean(...args: any[]) {
      if (typeof args[0] === 'function') {
        DevTools.boolean<S>(events, ctx, initial, args[0]);
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
