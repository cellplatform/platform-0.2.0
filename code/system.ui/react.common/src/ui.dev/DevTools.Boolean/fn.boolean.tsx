import { t } from '../common';
import { Boolean } from './ui.Boolean';
import { ValueHandler } from '../DevTools/ValueHandler.mjs';

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

  const label = ValueHandler<string, S>(events);
  const value = ValueHandler<boolean, S>(events);
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
    onClick(handler) {
      clickHandlers.add(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const onClick = async () => {
      const current = value.current ?? false;
      clickHandlers.forEach((fn) => fn({ ...args, current, state, change }));
    };
    return (
      <Boolean
        value={value.current}
        label={label.current}
        isEnabled={clickHandlers.size > 0}
        onClick={clickHandlers.size > 0 ? onClick : undefined}
      />
    );
  });

  label.subscribe(ref.redraw);
  value.subscribe(ref.redraw);

  fn?.(args);
}
