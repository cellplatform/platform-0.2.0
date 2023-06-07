import type { t } from '../../common.t';

type O = Record<string, unknown>;
type P = t.TestPropListRunData;
type Margin = t.CssValue['Margin'];
type ListInput = P['list'];

export type DevBddRunDef = {
  ctx?: P['ctx'];
  infoUrl?: P['infoUrl'];
  label?: P['label'];
};

/**
 * BDD (Behaviour Driven Development)
 */
export type DevBddHandler<S extends O = O> = (e: DevBddHandlerArgs<S>) => t.IgnoredResponse;
export type DevBddHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  localstore(id: string): DevBddHandlerArgs<S>;
  list(value: ListInput): DevBddHandlerArgs<S>;
  run(value: DevBddRunDef): DevBddHandlerArgs<S>;
  margin(value: Margin): DevBddHandlerArgs<S>;
  enabled(value: boolean | t.DevValueHandler<boolean, S>): DevBddHandlerArgs<S>;
  onChanged(fn: DevBddChangedHandler<S>): DevBddHandlerArgs<S>;
  redraw(subject?: boolean): void;
};

/**
 * BDD Click
 */
export type DevBddChangedHandler<S extends O = O> = (e: DevBDDClickHandlerArgs<S>) => void;
export type DevBDDClickHandlerArgs<S extends O = O> = DevBddHandlerArgs<S> &
  t.TestPropListChange & {
    dev: t.DevRenderProps;
    state: t.DevCtxState<S>;
    change: t.DevCtxState<S>['change'];
  };
