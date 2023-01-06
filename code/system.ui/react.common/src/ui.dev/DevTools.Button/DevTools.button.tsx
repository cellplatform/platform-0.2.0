import { Spec, t } from '../common';
import { Button } from './ui.Button';

type O = Record<string, unknown>;

import type { DevButtonHandler, DevButtonClickHandler, DevButtonHandlerArgs } from './types.mjs';

/**
 * A simple clickable text button implementation.
 */
export function button<S extends O = O>(input: t.DevCtxInput, initial: S, fn: DevButtonHandler<S>) {
  const ctx = Spec.ctx(input);
  if (!ctx.is.initial) return;

  const clickHandlers: DevButtonClickHandler<S>[] = [];
  const props = { label: '' };
  let _state: t.DevCtxState<S> | undefined;

  const args: DevButtonHandlerArgs<S> = {
    ctx,
    label(value) {
      props.label = value;
      ref.redraw();
      return args;
    },
    onClick(handler) {
      clickHandlers.push(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    return (
      <Button
        label={props.label}
        onClick={async () => {
          const state = _state || (_state = await ctx.state<S>(initial));
          clickHandlers.forEach((fn) => fn({ ...args, state }));
        }}
      />
    );
  });

  fn?.(args);
}
