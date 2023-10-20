import type { t } from './common';
export type * from './types.event';
export type * from './types.props';

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
export type LabelItemRendered = JSX.Element | undefined | false | null;
export type LabelItemRender = (e: LabelItemRenderArgs) => LabelItemRendered;
export type LabelItemRenderArgs = t.LabelItemValueArgs & { color: string };
export type LabelItemRenderActionArgs<A extends K = string> = t.LabelItemRenderArgs & { kind: A };

type H = LabelItemActionRenderHelpers;
export type LabelItemRenderers<A extends K = string> = {
  label?: t.LabelItemRender;
  placeholder?: t.LabelItemRender;
  action?(e: LabelItemRenderActionArgs<A>, helpers: H): LabelItemRendered;
};

type S = t.IconProps['size'];
type O = t.IconProps['offset'];
export type LabelItemActionRenderHelpers = {
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
