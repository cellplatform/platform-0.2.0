import { Lorem } from '../../ui.tools';
import { DevBase, Spec, t } from '../common';
import { boolean } from '../DevTools.Boolean';
import { button } from '../DevTools.Button';
import { hr } from '../DevTools.Hr';
import { title } from '../DevTools.Title';
import { todo } from '../DevTools.Todo';
import { Helpers } from './Helpers.mjs';

type O = Record<string, unknown>;

/**
 * Initializes a DevTools instance with the given
 * context ({ctx}) curried within the closure.
 */
export function init<S extends O = O>(input: t.DevCtxInput, initialState?: S) {
  const initial = initialState ?? ({} as S);
  const ctx = Spec.ctx(input);
  const debug = ctx.debug;
  const events = DevBase.Bus.events(input);
  let _state: t.DevCtxState<S> | undefined;

  const api: t.DevTools<S> = {
    ctx,

    header: debug.header,
    footer: debug.footer,
    row: debug.row,

    /**
     * Helpers
     */
    section(...args: any[]) {
      if (typeof args[0] === 'string') {
        api.title(args[0]);
        if (typeof args[1] === 'function') {
          api.section(args[1]);
        } else {
          api.TODO(`"${args[0] ?? 'Unnamed'}" section`);
        }
      }
      if (typeof args[0] === 'function') {
        args[0](api);
      }
      return api;
    },

    async change(fn) {
      const state = _state || (_state = await ctx.state(initial));
      return state.change(fn);
    },

    lorem(words, endWith) {
      return Lorem.words(words, endWith);
    },

    theme(value) {
      Helpers.theme(ctx, value);
      return api;
    },

    /**
     * Widgets: Argument Wrangling.
     */

    button(...args: any[]) {
      if (typeof args[0] === 'string') {
        api.button((btn) => btn.label(args[0]).onClick(args[1]));
      }
      if (typeof args[0] === 'function') {
        button<S>(events, ctx, initial, args[0]);
      }
      return api;
    },

    boolean(...args: any[]) {
      if (typeof args[0] === 'function') {
        boolean<S>(events, ctx, initial, args[0]);
      }
      return api;
    },

    title(...args: any[]) {
      if (typeof args[0] === 'string') {
        api.title((title) => title.text(args[0]).style(args[1]));
      }
      if (typeof args[0] === 'function') {
        title<S>(events, ctx, initial, args[0]);
      }
      return api;
    },

    TODO(...args: any[]) {
      if (args.length === 0) {
        return api.TODO('');
      }
      if (typeof args[0] === 'string') {
        api.TODO((title) => title.text(args[0]).style(args[1]));
      }
      if (typeof args[0] === 'function') {
        todo<S>(events, ctx, initial, args[0]);
      }
      return api;
    },

    hr() {
      hr(ctx);
      return api;
    },
  };

  return api;
}
