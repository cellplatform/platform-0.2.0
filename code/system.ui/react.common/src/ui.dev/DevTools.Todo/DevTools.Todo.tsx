import { t } from '../common';
import { Dev } from '../Dev.mjs';
import { Todo } from './ui.Todo';

type O = Record<string, unknown>;

/**
 * A TODO placeholder.
 */
export function todo<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevTodoHandler<S>,
) {
  if (!ctx.is.initial) return;

  const text = Dev.ValueHandler<string, S>(events);
  const style = Dev.ValueHandler<t.DevTodoStyle, S>(events);

  const args: t.DevTodoHandlerArgs<S> = {
    ctx,
    text(value) {
      text.handler(value);
      return args;
    },
    style(input) {
      const value = input === null ? Todo.DEFAULT.style : input;
      style.handler(value);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    return <Todo text={text.current} style={style.current} />;
  });

  text.subscribe(ref.redraw);
  style.subscribe(ref.redraw);

  fn?.(args);
}
