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

/**
 * JSX Renderer (data → visuals)
 */
export type LabelItemRendered = JSX.Element | undefined | false | null;
export type LabelItemRenderer = (e: LabelItemRendererArgs) => LabelItemRendered;
export type LabelItemRendererArgs = LabelItemValueArgs & { color: string };

export type LabelItemValueArgs = {
  index: number;
  total: number;
  enabled: boolean;
  editing: boolean;
  selected: boolean;
  focused: boolean;
  item: t.LabelItem;
};

export type LabelItemRenderers<A extends LabelItemActionKind = string> = {
  label?: t.LabelItemRenderer;
  placeholder?: t.LabelItemRenderer;
  action?(kind: A, helpers: LabelItemActionRenderHelpers): t.LabelItemRenderer | void;
};

export type LabelItemActionRenderHelpers = {
  opacity(e: t.LabelItemRendererArgs): number;
  icon(
    e: t.LabelItemRendererArgs,
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
