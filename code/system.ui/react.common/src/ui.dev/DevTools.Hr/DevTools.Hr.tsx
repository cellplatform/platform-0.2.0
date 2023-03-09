import { t, ValueHandler } from '../common';
import { Hr } from './ui.Hr';

type O = Record<string, unknown>;

/**
 * HR: Horizontal-rule (visual divider).
 */
export function hr<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevHrHandler<S>,
) {
  if (!ctx.is.initial) return;

  const margin = ValueHandler<t.DevHrMargin, S>(events);
  const color = ValueHandler<t.DevHrColor, S>(events);
  const thickness = ValueHandler<number, S>(events);
  const opacity = ValueHandler<number, S>(events);

  const args: t.DevHrHandlerArgs<S> = {
    ctx,
    margin(value) {
      margin.handler(value);
      return args;
    },
    color(value) {
      color.handler(value);
      return args;
    },
    thickness(value) {
      thickness.handler(value);
      return args;
    },
    opacity(value) {
      opacity.handler(value);
      return args;
    },
  };

  const ref = ctx.debug.row((e) => {
    return (
      <Hr
        marginY={margin.current}
        color={color.current}
        thickness={thickness.current}
        opacity={opacity.current}
      />
    );
  });

  margin.subscribe(ref.redraw);
  color.subscribe(ref.redraw);
  thickness.subscribe(ref.redraw);
  opacity.subscribe(ref.redraw);

  fn?.(args);
}
