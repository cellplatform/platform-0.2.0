import type * as t from '../../common/types.mjs';

type O = Record<string, unknown>;

/**
 * Button
 */
export type DevButtonHandler<S extends O = O> = (e: DevButtonHandlerArgs<S>) => t.IgnoredResponse;
export type DevButtonHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  label(value: string | t.DevValueHandler<string, S>): DevButtonHandlerArgs<S>;
  onClick(fn: DevButtonClickHandler<S>): DevButtonHandlerArgs<S>;
};

/**
 * Button Click
 */
export type DevButtonClickHandler<S extends O = O> = (e: DevButtonClickHandlerArgs<S>) => void;
export type DevButtonClickHandlerArgs<S extends O = O> = DevButtonHandlerArgs<S> & {
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
};
