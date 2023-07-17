import { COLORS, Color, DEFAULTS, Icons, type t } from './common';

export const Wrangle = {
  flagProps(props: t.LabelItemProps) {
    const {
      enabled = DEFAULTS.enabled,
      editing = DEFAULTS.editing,
      selected = DEFAULTS.selected,
      focused = DEFAULTS.focused,
    } = props;
    return { enabled, editing, selected, focused } as const;
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
    const color = selected ? Color.format(0) : COLORS.BLUE;
    return color;
  },

  icon(args: { action: t.LabelAction; selected?: boolean; enabled?: boolean }) {
    const { action, enabled = DEFAULTS.enabled, selected = DEFAULTS.selected } = args;
    const { icon } = action;

    if (!icon) {
      return Wrangle.defaultIcon(args);
    }

    if (typeof action.icon === 'function') {
      const color = Wrangle.foreColor(args);
      const el = action.icon({ enabled, selected, color });
      return el ?? Wrangle.defaultIcon(args);
    }

    return;
  },

  defaultIcon(args: { selected?: boolean }) {
    const color = Wrangle.foreColor(args);
    return <Icons.Repo size={18} color={color} offset={[0, 1]} />;
  },
};
