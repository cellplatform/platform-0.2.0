import type { t } from '../../common.t';

type O = Record<string, unknown>;
type Margin = t.CssValue['Margin'];

/**
 * BDD (Behaviour Driven Development)
 */
export type DevBddHandler<S extends O = O> = (e: DevBddHandlerArgs<S>) => t.IgnoredResponse;
export type DevBddHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  initial(value: t.TestPropListData): DevBddHandlerArgs<S>;
  margin(value: Margin): DevBddHandlerArgs<S>;
  enabled(value: boolean | t.DevValueHandler<boolean, S>): DevBddHandlerArgs<S>;
  onChange(fn: DevBddChangedHandler<S>): DevBddHandlerArgs<S>;
  redraw(subject?: boolean): void;
};

/**
 * BDD Click
 */
export type DevBddChangedHandler<S extends O = O> = (e: DevBDDClickHandlerArgs<S>) => void;
export type DevBDDClickHandlerArgs<S extends O = O> = DevBddHandlerArgs<S> & {
  dev: t.DevRenderProps;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
  event: t.TestPropListChange;
};
