import type { t } from '../../common.t';

type O = Record<string, unknown>;
type BoolOrUndefined = boolean | undefined;

/**
 * Boolean
 */
export type DevTextboxHandler<S extends O = O> = (e: DevTextboxHandlerArgs<S>) => t.IgnoredResponse;
export type DevTextboxHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  label(value: string | t.DevValueHandler<string, S>): DevTextboxHandlerArgs<S>;
  value(value: BoolOrUndefined | t.DevValueHandler<BoolOrUndefined, S>): DevTextboxHandlerArgs<S>;
  enabled(value: boolean | t.DevValueHandler<boolean, S>): DevTextboxHandlerArgs<S>;
  onClick(fn: DevTextboxClickHandler<S>): DevTextboxHandlerArgs<S>;
};

/**
 * Boolean Click
 */
export type DevTextboxClickHandler<S extends O = O> = (e: DevTextboxClickHandlerArgs<S>) => void;
export type DevTextboxClickHandlerArgs<S extends O = O> = DevTextboxHandlerArgs<S> & {
  dev: t.DevRenderProps;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
  current: boolean;
};
