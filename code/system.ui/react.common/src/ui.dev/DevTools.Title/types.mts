import type { t } from '../../common.t';

type O = Record<string, unknown>;
type StyleArg<S extends O> = t.DevTitleStyle | t.DevValueHandler<t.DevTitleStyle, S> | null;

/**
 * Display title.
 */
export type DevTitleHandler<S extends O = O> = (e: DevTitleHandlerArgs<S>) => t.IgnoredResponse;
export type DevTitleHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  text(value: string | t.DevValueHandler<string, S>): DevTitleHandlerArgs<S>;
  style(value: StyleArg<S>): DevTitleHandlerArgs<S>;
  onClick(fn: DevTitleClickHandler<S>): DevTitleHandlerArgs<S>;
};

export type DevTitleStyle = {
  margin?: t.CssValue['Margin'];
  color?: t.CssValue['color'];
  bold?: boolean;
  ellipsis?: boolean;
};

/**
 * Title click.
 */
export type DevTitleClickHandler<S extends O = O> = (e: DevTitleClickHandlerArgs<S>) => void;
export type DevTitleClickHandlerArgs<S extends O = O> = DevTitleHandlerArgs<S> & {
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
};
