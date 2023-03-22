import type { t } from '../../common.t';

type O = Record<string, unknown>;
type BoolOrNil = boolean | undefined | null;
type StringOrNil = string | undefined | null;
type ContentInput = StringOrNil | JSX.Element;
type ErrorInput = DevTextboxError | boolean | undefined | null;
type MarginOrNil = t.MarginInput | undefined | null;

export type DevTextboxError = 'error' | 'warning';

/**
 * Textbox
 */
export type DevTextboxHandler<S extends O = O> = (e: DevTextboxHandlerArgs<S>) => t.IgnoredResponse;
export type DevTextboxHandlerArgs<S extends O = O> = {
  ctx: t.DevCtx;
  enabled(value: BoolOrNil | t.DevValueHandler<BoolOrNil, S>): DevTextboxHandlerArgs<S>;
  label(value: ContentInput | t.DevValueHandler<ContentInput, S>): DevTextboxHandlerArgs<S>;
  value(value: StringOrNil | t.DevValueHandler<StringOrNil, S>): DevTextboxHandlerArgs<S>;
  placeholder(value: ContentInput | t.DevValueHandler<ContentInput, S>): DevTextboxHandlerArgs<S>;
  left(value: ContentInput | t.DevValueHandler<ContentInput, S>): DevTextboxHandlerArgs<S>;
  right(value: ContentInput | t.DevValueHandler<ContentInput, S>): DevTextboxHandlerArgs<S>;
  footer(value: ContentInput | t.DevValueHandler<ContentInput, S>): DevTextboxHandlerArgs<S>;
  error(value: ErrorInput | t.DevValueHandler<ErrorInput, S>): DevTextboxHandlerArgs<S>;
  margin(value: MarginOrNil | t.DevValueHandler<MarginOrNil, S>): DevTextboxHandlerArgs<S>;
  onChange(fn: DevTextboxChangeHandler<S>): DevTextboxHandlerArgs<S>;
  onEnter(fn: DevTextboxEnterHandler<S>): DevTextboxHandlerArgs<S>;
};

/**
 * Change
 */
export type DevTextboxChangeHandler<S extends O = O> = (e: DevTextboxChangeHandlerArgs<S>) => void;
export type DevTextboxChangeHandlerArgs<S extends O = O> = DevTextboxHandlerArgs<S> & {
  dev: t.DevRenderProps;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
  next: string;
};

export type DevTextboxEnterHandler<S extends O = O> = (e: DevTextboxEnterHandlerArgs<S>) => void;
export type DevTextboxEnterHandlerArgs<S extends O = O> = DevTextboxHandlerArgs<S> & {
  dev: t.DevRenderProps;
  state: t.DevCtxState<S>;
  change: t.DevCtxState<S>['change'];
};
