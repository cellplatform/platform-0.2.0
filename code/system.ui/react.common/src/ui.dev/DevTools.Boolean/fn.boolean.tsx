import { Spec, t } from '../common';
import { Boolean } from './ui.Boolean';

type O = Record<string, unknown>;
import type { DevBooleanHandler, DevBooleanClickHandler, DevBooleanHandlerArgs } from './types.mjs';

const DEFAULT = Boolean.DEFAULT;

/**
 * A simple clickable text-busson that represents a boolean value.
 */
export function boolean<S extends O = O>(
  input: t.DevCtxInput,
  initial: S,
  fn: DevBooleanHandler<S>,
) {
  const ctx = Spec.ctx(input);
  if (!ctx.is.initial) return;

  const clickHandlers: DevBooleanClickHandler<S>[] = [];
  const props = {
    value: DEFAULT.value,
    label: DEFAULT.label,
  };

  const args: DevBooleanHandlerArgs<S> = {
    ctx,
    label(value) {
      props.label = value;
      ref.redraw();
      return args;
    },
    value(value) {
      props.value = value;
      ref.redraw();
      return args;
    },
    onClick(handler) {
      clickHandlers.push(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const onClick = async () => {
      const current = props.value;
      const state = await ctx.state<S>(initial);
      const change = state.change;
      clickHandlers.forEach((fn) => fn({ ...args, current, state, change }));
    };
    return (
      <Boolean
        value={props.value}
        label={props.label}
        onClick={clickHandlers.length > 0 ? onClick : undefined}
      />
    );
  });

  fn?.(args);
}
