import type { t } from './common';

export type * from './types.props';
export type * from './types.event';

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
export type LabelItemRendered = JSX.Element | undefined | false | null;
export type LabelItemRender = (e: LabelItemRenderArgs) => LabelItemRendered;
export type LabelItemRenderArgs = LabelItemValueArgs & { color: string };

export type LabelItemRenderers<A extends LabelItemActionKind = string> = {
  label?: t.LabelItemRender;
  placeholder?: t.LabelItemRender;
  action?(kind: A, helpers: LabelItemActionRenderHelpers): t.LabelItemRender | void;
};

export type LabelItemActionRenderHelpers = {
  opacity(e: t.LabelItemRenderArgs): number;
  icon(
    e: t.LabelItemRenderArgs,
    size?: t.IconProps['size'],
    offset?: t.IconProps['offset'],
  ): t.IconProps;
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
