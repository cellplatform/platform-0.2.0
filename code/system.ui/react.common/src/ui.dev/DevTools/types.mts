import * as t from '../../common/types.mjs';

type O = Record<string, unknown>;

/**
 * Index of development tools (UI widgets).
 */
export type DevTools<S extends O = O> = {
  ctx: t.DevCtx;

  button(label: string, onClick?: t.DevButtonClickHandler<S>): DevTools<S>;
  button(fn: t.DevButtonHandler<S>): DevTools<S>;

  boolean(fn: t.DevBooleanHandler<S>): DevTools<S>;

  hr(): DevTools<S>;
};

/**
 * Dynamic value.
 * A value is recalculated for the employing widget each time the state/props updates.
 */
export type DevValueHandler<R, S extends O = O> = (e: DevValueHandlerArgs<S>) => R;
export type DevValueHandlerArgs<S extends O = O> = { state: S };
