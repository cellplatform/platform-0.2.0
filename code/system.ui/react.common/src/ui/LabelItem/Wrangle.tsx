import { COLORS, Color, DEFAULTS, Icons, type t } from './common';

type RenderArgs = {
  index: number;
  total: number;
  item: t.LabelItem;
  selected?: boolean;
  enabled?: boolean;
  focused?: boolean;
  editing?: boolean;
};

export const Wrangle = {
  valuesOrDefault(props: Partial<t.LabelItemValueArgs>): t.LabelItemValueArgs {
    const {
      index = DEFAULTS.index,
      total = DEFAULTS.total,
      selected = DEFAULTS.selected,
      editing = DEFAULTS.editing,
      focused = DEFAULTS.focused,
      item = {},
    } = props;
    const enabled = props.enabled ?? item.enabled ?? DEFAULTS.enabled;
    return { index, total, enabled, selected, focused, editing, item } as const;
  },

  labelText(args: { label?: string }) {
    const text = args.label || '';
    const hasValue = Boolean(text.trim());
    const isEmpty = !hasValue;
    return { text, hasValue, isEmpty } as const;
  },

  backgroundColor(args: { selected?: boolean; focused?: boolean }) {
    const { selected = DEFAULTS.selected, focused = DEFAULTS.focused } = args;
    if (!selected) return undefined;
    return focused ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.08);
  },

  foreColor(args: { selected?: boolean; focused?: boolean }) {
    const { selected = DEFAULTS.selected, focused = DEFAULTS.focused } = args;
    return selected && focused ? COLORS.WHITE : COLORS.DARK;
  },

  borderColor(args: { selected?: boolean; focused?: boolean }) {
    const { selected = DEFAULTS.selected, focused = DEFAULTS.focused } = args;
    if (!focused) return Color.format(0);
    const color = selected ? Color.format(0) : Color.alpha(COLORS.BLUE, 0.3);
    return color;
  },

  renderer(renderers: t.LabelItemRenderers, kind: t.LabelItemActionKind) {
    const done = (res?: t.LabelItemRenderer | void) => res ?? undefined;

    if (typeof renderers.action === 'function') {
      const res = renderers.action?.(kind, actionHelpers);
      if (res) return done(res);
    }
    return done(DEFAULTS.renderers.action?.(kind, actionHelpers));
  },

  element(renderer: t.LabelItemRenderer | undefined, args: RenderArgs) {
    if (typeof renderer === 'string') return renderer;
    if (typeof renderer === 'function') {
      const { index, total } = args;
      const { enabled, selected, focused, editing, item } = Wrangle.valuesOrDefault(args);
      const color = Wrangle.foreColor(args);
      const el = renderer({
        index,
        total,
        item,
        enabled,
        selected,
        focused,
        editing,
        color,
      });
      return el;
    }
    return undefined;
  },

  icon(renderer: t.LabelItemRenderer | undefined, args: RenderArgs) {
    const el = Wrangle.element(renderer, args);
    if (el === null || el === false) return null;
    return el || Wrangle.defaultIcon(args);
  },

  defaultIcon(args: { selected?: boolean }) {
    const color = Wrangle.foreColor(args);
    return <Icons.Face size={18} color={color} offset={[0, 0]} />;
  },
} as const;

/**
 * Helpers
 */

const actionHelpers: t.LabelItemActionRenderHelpers = {
  opacity(e: t.LabelItemRendererArgs) {
    if (e.enabled) return 0.9;
    return e.selected && e.focused ? 0.5 : 0.3;
  },
  icon(e: t.LabelItemRendererArgs, size, offset): t.IconProps {
    return {
      color: e.color,
      opacity: actionHelpers.opacity(e),
      size,
      offset,
    };
  },
};
