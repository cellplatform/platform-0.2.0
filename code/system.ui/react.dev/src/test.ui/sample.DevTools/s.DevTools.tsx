import { Spec, t, R } from '../common';
import { ButtonSample, ButtonSampleClickHandler } from './s.ui.Button';

type ButtonHandler = (e: ButtonHandlerArgs) => t.IgnoredResponse;
type ButtonHandlerArgs = {
  ctx: t.DevCtx;
  label(value: string): ButtonHandlerArgs;
  onClick(fn: ButtonSampleClickHandler): ButtonHandlerArgs;
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
  curry(input: t.DevCtxInput) {
    return {
      button: R.partial(DevTools.button, [input]),
    };
  },

  /**
   * A simple clickable text button implementation.
   */
  button(input: t.DevCtxInput, fn?: ButtonHandler) {
    return Spec.once(input, (ctx) => {
      const clickHandlers: ButtonSampleClickHandler[] = [];

      const props = {
        label: '',
      };

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

      const ref = ctx.debug.render((e) => {
        return (
          <ButtonSample
            ctx={ctx}
            label={props.label}
            onClick={(e) => clickHandlers.forEach((fn) => fn(e))}
          />
        );
      });

      fn?.(args);
    });
  },
};
