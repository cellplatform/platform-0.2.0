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
export const SampleDevTools = (input: t.DevCtxInput) => {
  return {
    button(fn?: ButtonHandler) {
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
};
