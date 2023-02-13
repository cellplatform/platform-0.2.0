import { t } from '../common';
import { Dev } from '../Dev.mjs';
import { Button } from './ui.Button';

type O = Record<string, unknown>;
type RightInput = string | JSX.Element;

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

  const label = Dev.ValueHandler<string, S>(events);
  const right = Dev.ValueHandler<RightInput, S>(events);
  const enabled = Dev.ValueHandler<boolean, S>(events);
  const clickHandlers = new Set<t.DevButtonClickHandler<S>>();

  const args: t.DevButtonHandlerArgs<S> = {
    ctx,
    label(value) {
      label.handler(value);
      return args;
    },
    right(value) {
      right.handler(value);
      return args;
    },
    enabled(value) {
      enabled.handler(value);
      return args;
    },
    onClick(handler) {
      if (typeof handler === 'function') clickHandlers.add(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const dev = ctx.toObject().props;
    const elRight = typeof right.current === 'string' ? <div>{right.current}</div> : right.current;
    const onClick = () => clickHandlers.forEach((fn) => fn({ ...args, dev, state, change }));

    const hasHandlers = clickHandlers.size > 0;
    const isEnabled = hasHandlers && enabled.current !== false;

    return (
      <Button
        label={label.current}
        rightElement={elRight}
        enabled={isEnabled}
        onClick={hasHandlers ? onClick : undefined}
      />
    );
  });

  label.subscribe(ref.redraw);

  fn?.(args);
}
