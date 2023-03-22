import { t, ValueHandler } from '../common';
import { Textbox } from './ui.Textbox';

type O = Record<string, unknown>;

/**
 * A plain-text Textbox input.
 */
export function textbox<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevTextboxHandler<S>,
) {
  if (!ctx.is.initial) return;

  const label = ValueHandler<string, S>(events);
  const value = ValueHandler<boolean | undefined, S>(events);
  const enabled = ValueHandler<boolean, S>(events);
  const clickHandlers = new Set<t.DevTextboxClickHandler<S>>();

  const args: t.DevTextboxHandlerArgs<S> = {
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
      <Textbox
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
