import { t } from '../common';
import { Dev } from '../Dev.mjs';
import { Boolean } from './ui.Boolean';

type O = Record<string, unknown>;

/**
 * A simple clickable text-busson that represents a boolean value.
 */
export function boolean<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevBooleanHandler<S>,
) {
  if (!ctx.is.initial) return;

  const label = Dev.ValueHandler<string, S>(events);
  const value = Dev.ValueHandler<boolean | undefined, S>(events);
  const enabled = Dev.ValueHandler<boolean, S>(events);
  const clickHandlers = new Set<t.DevBooleanClickHandler<S>>();

  const args: t.DevBooleanHandlerArgs<S> = {
    ctx,
    label(input) {
      label.handler(input);
      return args;
    },
    value(input) {
      value.handler(input);
      return args;
    },
    enabled(input) {
      enabled.handler(input);
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
    const onClick = async () => {
      const current = value.current ?? false;
      const dev = ctx.toObject().props;
      clickHandlers.forEach((fn) => fn({ ...args, dev, current, state, change }));
    };

    const hasHandlers = clickHandlers.size > 0;
    const isEnabled = hasHandlers && enabled.current !== false;

    return (
      <Boolean
        value={value.current}
        label={label.current}
        isEnabled={isEnabled}
        onClick={hasHandlers ? onClick : undefined}
      />
    );
  });

  label.subscribe(ref.redraw);
  value.subscribe(ref.redraw);

  fn?.(args);
}
