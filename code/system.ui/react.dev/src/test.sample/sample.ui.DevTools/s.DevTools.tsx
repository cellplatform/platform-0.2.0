import { Spec, t } from '../common';
import { ButtonSample, ButtonSampleClickHandler } from './s.ui.Button';

type ButtonHandler = (e: ButtonHandlerArgs) => t.IgnoredResponse;
type ButtonHandlerArgs = {
  ctx: t.DevCtx;
  label(value: string): ButtonHandlerArgs;
  onClick(fn: ButtonSampleClickHandler): ButtonHandlerArgs;
};

/**
 * Sample [DevTools].
 *    See 'sys.ui.react.common' for baseline tools.
 *    These tools are seperated out into the 'common' lib to prevent
 *    low-level ciruclar dependencies where the `sys.ui.dev` module
 *    becomes impossible not to bundle with all other components.
 */
export const DevToolsSample = {
  /**
   * Render an user-invokable button.
   */
  button(input: t.DevCtxInput, fn?: ButtonHandler) {
    return Spec.once(input, (ctx) => {
      const clickHandlers: ButtonSampleClickHandler[] = [];

      const args: ButtonHandlerArgs = {
        ctx,
        label(value) {
          console.log('label', value);
          return args;
        },
        onClick(handler) {
          clickHandlers.push(handler);
          return args;
        },
      };

      fn?.(args);
      ctx.debug.render((e) => {
        console.log('render button');
        return <ButtonSample ctx={ctx} onClick={(e) => clickHandlers.forEach((fn) => fn(e))} />;
      });
    });
  },
};
