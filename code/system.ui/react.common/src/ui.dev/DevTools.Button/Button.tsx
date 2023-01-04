import { Spec, t } from '../common';
import { Button, ButtonClickHandler } from './ui.Button';

export type DevButtonHandler = (e: DevButtonHandlerArgs) => t.IgnoredResponse;
export type DevButtonHandlerArgs = {
  ctx: t.DevCtx;
  label(value: string): DevButtonHandlerArgs;
  onClick(fn: ButtonClickHandler): DevButtonHandlerArgs;
};

/**
 * A simple clickable text button implementation.
 */
export function button(input: t.DevCtxInput, fn?: DevButtonHandler) {
  return Spec.once(input, (ctx) => {
    const clickHandlers: ButtonClickHandler[] = [];

    const props = {
      label: '',
    };

    const args: DevButtonHandlerArgs = {
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
        <Button
          ctx={ctx}
          label={props.label}
          onClick={(e) => clickHandlers.forEach((fn) => fn(e))}
        />
      );
    });

    fn?.(args);
  });
}
