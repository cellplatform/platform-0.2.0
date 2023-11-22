import type { t } from './common';
export type * from './t.event';
export type * from './t.props';

export type LabelItemPosition = { index: number; total: number };

/**
 * An "action" represented as a clickable icon button.
 */
export type LabelItemActionKind = string;
export type LabelItemAction<K extends LabelItemActionKind = string> = {
  kind: K;
  width?: number;
  enabled?: boolean;
  spinning?: boolean;
  button?: boolean;
};

export type LabelItemValueArgs = {
  index: number;
  total: number;
  enabled: boolean;
  editing: boolean;
  selected: boolean;
  focused: boolean;
  item: t.LabelItem;
};

/**
 * JSX Renderer (data → visuals)
 */
type K = t.LabelItemActionKind;
export type LabelItemRender = (e: LabelItemRenderArgs) => LabelItemRenderResponse;
export type LabelItemRenderResponse = JSX.Element | string | undefined | false | null;
export type LabelItemRenderArgs = t.LabelItemValueArgs & { color: string };
export type LabelItemRenderActionArgs<A extends K = string> = t.LabelItemRenderArgs & {
  readonly kind: A;
  readonly set: {
    ctx(value: t.LabelItemActionCtx): void;
  };
};

type H = LabelItemActionHelpers;
export type LabelItemRenderers<A extends K = string> = {
  label?: t.LabelItemRender;
  placeholder?: t.LabelItemRender;
  action?(e: LabelItemRenderActionArgs<A>, helpers: H): LabelItemRenderResponse;
};

type S = t.IconProps['size'];
type O = t.IconProps['offset'];
export type LabelItemActionHelpers = {
  opacity(e: t.LabelItemRenderArgs): number;
  icon(e: t.LabelItemRenderArgs, size?: S, offset?: O): t.IconProps;
};

/**
 * ref={ ƒ }
 */
export type LabelItemRef = {
  focus(): void;
  blur(): void;
  selectAll(): void;
  selectAll(): void;
  cursorToStart(): void;
  cursorToEnd(): void;
};
