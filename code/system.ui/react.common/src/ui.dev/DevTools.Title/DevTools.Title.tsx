import { t, ValueHandler } from '../common';

import { Title } from './ui.Title';

type O = Record<string, unknown>;

/**
 * A display title.
 */
export function title<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevTitleHandler<S>,
) {
  if (!ctx.is.initial) return;

  const text = ValueHandler<string, S>(events);
  const style = ValueHandler<t.DevTitleStyle, S>(events);
  const clickHandlers = new Set<t.DevTitleClickHandler<S>>();

  const args: t.DevTitleHandlerArgs<S> = {
    ctx,
    text(value) {
      text.handler(value);
      return args;
    },
    style(input) {
      const value = input === null ? Title.DEFAULT.style : input;
      style.handler(value);
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
    const onClick = () => clickHandlers.forEach((fn) => fn({ ...args, state, change }));
    return (
      <Title
        text={text.current}
        style={style.current}
        onClick={clickHandlers.size > 0 ? onClick : undefined}
      />
    );
  });

  text.subscribe(ref.redraw);
  style.subscribe(ref.redraw);

  fn?.(args);
}
