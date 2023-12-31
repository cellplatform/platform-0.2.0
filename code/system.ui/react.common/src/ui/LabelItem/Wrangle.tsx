import { COLORS, Color, DEFAULTS, type t } from './common';
import { dataid } from '../LabelItem.Stateful/Wrangle.dataid';

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
  dataid,

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

  render: {
    action(renderers: t.LabelItemRenderers, args: t.LabelItemRenderActionArgs) {
      const { action } = renderers;
      const defaultAction = DEFAULTS.renderers.action;
      const fn = typeof action === 'function' ? action : defaultAction;
      const res = fn?.(args, actionHelpers);
      return res === undefined ? defaultAction?.(args, actionHelpers) : res;
    },

    element(renderer: t.LabelItemRender | undefined, args: RenderArgs) {
      if (typeof renderer === 'string') return renderer;
      if (typeof renderer === 'function') {
        const { index, total } = args;
        const { enabled, selected, focused, editing, item } = Wrangle.valuesOrDefault(args);
        const color = Wrangle.foreColor(args);
        return renderer({ index, total, item, enabled, selected, focused, editing, color });
      }
      return undefined;
    },
  },
} as const;

/**
 * Helpers
 */
const actionHelpers: t.LabelItemActionHelpers = {
  opacity(e: t.LabelItemRenderArgs) {
    if (e.enabled) return 0.9;
    return e.selected && e.focused ? 0.5 : 0.3;
  },
  icon(e: t.LabelItemRenderArgs, size, offset): t.IconProps {
    return {
      color: e.color,
      opacity: actionHelpers.opacity(e),
      size,
      offset,
    };
  },
};
