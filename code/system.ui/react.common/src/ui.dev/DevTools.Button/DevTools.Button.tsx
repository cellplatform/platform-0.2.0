import { t, ValueHandler } from '../common';

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

  const values = {
    label: ValueHandler<string, S>(events),
    right: ValueHandler<RightInput, S>(events),
    enabled: ValueHandler<boolean, S>(events),
  };
  const clickHandlers = new Set<t.DevButtonClickHandler<S>>();

  const args: t.DevButtonHandlerArgs<S> = {
    ctx,
    label(value) {
      values.label.handler(value);
      return args;
    },
    right(value) {
      values.right.handler(value);
      return args;
    },
    enabled(value) {
      values.enabled.handler(value);
      return args;
    },
    onClick(handler) {
      if (typeof handler === 'function') clickHandlers.add(handler);
      return args;
    },
    redraw(subject) {
      Object.values(values).forEach((value) => value.redraw());
      if (subject) events.redraw.subject();
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const dev = ctx.toObject().props;
    const right = values.right.current;
    const elRight = typeof right === 'string' ? <div>{right}</div> : right;
    const onClick = () => clickHandlers.forEach((fn) => fn({ ...args, dev, state, change }));

    const hasHandlers = clickHandlers.size > 0;
    const isEnabled = hasHandlers && values.enabled.current !== false;

    return (
      <Button
        label={values.label.current}
        rightElement={elRight}
        enabled={isEnabled}
        onClick={hasHandlers ? onClick : undefined}
      />
    );
  });

  Object.values(values).forEach((value) => value.subscribe(ref.redraw));
  fn?.(args);
}
