import * as t from '../../common/types.mjs';

type O = Record<string, unknown>;

/**
 * Boolean
 */
export type DevBooleanHandler<S extends O = O> = (e: DevBooleanHandlerArgs<S>) => t.IgnoredResponse;
export type DevBooleanHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  label(value: string): DevBooleanHandlerArgs<S>;
  value(value: boolean): DevBooleanHandlerArgs<S>;
  onClick(fn: DevBooleanClickHandler<S>): DevBooleanHandlerArgs<S>;
};

/**
 * Boolean Click
 */
export type DevBooleanClickHandler<S extends O = O> = (e: DevBooleanClickHandlerArgs<S>) => void;
export type DevBooleanClickHandlerArgs<S extends O = O> = DevBooleanHandlerArgs<S> & {
  current: boolean;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
};
