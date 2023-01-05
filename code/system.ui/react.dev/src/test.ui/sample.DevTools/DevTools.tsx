import { Spec, t, R } from '../common';
import { ButtonSample } from './ui.Button';
import { Hr } from './ui.Hr';

type ButtonClickHandler = (e: ButtonHandlerArgs) => void;
type ButtonHandler = (e: ButtonHandlerArgs) => t.IgnoredResponse;
type ButtonHandlerArgs = {
  ctx: t.DevCtx;
  label(value: string): ButtonHandlerArgs;
  onClick(fn: ButtonClickHandler): ButtonHandlerArgs;
};

/**
 * Sample [DevTools].
 *
 * NOTES:
 *
 *    See the [sys.ui.react.common/dev] module for the implementatino of baseline
 *    DebugPanel UI widgets, aka. "DevTools"
 *
 *    These UI tools (such as buttons etc) are seperated out into
 *    the 'common' lib to prevent low-level ciruclar dependencies
 *    where the `sys.ui.dev` module becomes impossible not to bundle
 *    with all other components.
 */
export const DevTools = {
  init(input: t.DevCtxInput) {
    const ctx = Spec.ctx(input);
    return {
      ctx,
      button: R.partial(DevTools.button, [input]),
      hr: () => DevTools.hr(input),
    };
  },

  /**
   * A simple clickable text button implementation.
   */
  button(input: t.DevCtxInput, fn?: ButtonHandler) {
    return Spec.once(input, (ctx) => {
      const clickHandlers: ButtonClickHandler[] = [];
      const props = { label: '' };

      const args: ButtonHandlerArgs = {
        ctx,
        label(value) {
          props.label = value;
          ref.redraw();
          return args;
        },
        onClick(handler) {
          clickHandlers.push(handler);
          return args;
        },
      };

      const ref = ctx.debug.row((e) => {
        return (
          <ButtonSample
            ctx={ctx}
            label={props.label}
            onClick={() => clickHandlers.forEach((fn) => fn(args))}
          />
        );
      });

      fn?.(args);
    });
  },

  /**
   * A horizontal rule (visual divider).
   */
  hr(input: t.DevCtxInput) {
    return Spec.once(input, (ctx) => ctx.debug.row(<Hr />));
  },
};
