import type { t } from '../../common.t';

type O = Record<string, unknown>;
type RightInput = string | JSX.Element;

/**
 * Button
 */
export type DevButtonHandler<S extends O = O> = (e: DevButtonHandlerArgs<S>) => t.IgnoredResponse;
export type DevButtonHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  enabled(value: boolean | t.DevValueHandler<boolean, S>): DevButtonHandlerArgs<S>;
  label(value: string | t.DevValueHandler<string, S>): DevButtonHandlerArgs<S>;
  right(value: RightInput | t.DevValueHandler<RightInput, S>): DevButtonHandlerArgs<S>;
  onClick(fn: DevButtonClickHandler<S>): DevButtonHandlerArgs<S>;
};

/**
 * Button Click
 */
export type DevButtonClickHandler<S extends O = O> = (e: DevButtonClickHandlerArgs<S>) => void;
export type DevButtonClickHandlerArgs<S extends O = O> = DevButtonHandlerArgs<S> & {
  dev: t.DevRenderProps;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
};
