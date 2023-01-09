import { t } from '../common';
import { ValueHandler } from '../DevTools/ValueHandler.mjs';
import { Button } from './ui.Button';

type O = Record<string, unknown>;

/**
 * A simple clickable text button implementation.
 */
export function button<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevButtonHandler<S>,
) {
  if (!ctx.is.initial) return;

  const label = ValueHandler<string, S>(events);
  const clickHandlers = new Set<t.DevButtonClickHandler<S>>();

  const args: t.DevButtonHandlerArgs<S> = {
    ctx,
    label(value) {
      label.handler(value);
      return args;
    },
    onClick(handler) {
      clickHandlers.add(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const onClick = () => clickHandlers.forEach((fn) => fn({ ...args, state, change }));
    return (
      <Button
        label={label.current}
        isEnabled={clickHandlers.size > 0}
        onClick={clickHandlers.size > 0 ? onClick : undefined}
      />
    );
  });

  label.subscribe(ref.redraw);

  fn?.(args);
}
