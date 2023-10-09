import { COLORS, Color, DEFAULTS, Icons, type t } from './common';

export const Wrangle = {
  valuesOrDefault(props: Partial<t.LabelItemDynamicValueArgs>): t.LabelItemDynamicValueArgs {
    const {
      index = DEFAULTS.index,
      total = DEFAULTS.total,
      enabled = DEFAULTS.enabled,
      selected = DEFAULTS.selected,
      focused = DEFAULTS.focused,
      editing = DEFAULTS.editing,
    } = props;
    return { index, total, enabled, selected, focused, editing } as const;
  },

  dynamicValue<T>(
    value: t.LabelItemValue<T> | undefined,
    flags: Partial<t.LabelItemDynamicValueArgs>,
    defaultValue: T,
  ) {
    if (typeof value === 'function') {
      const fn = value as t.LabelItemDynamicValue<T>;
      const args = Wrangle.valuesOrDefault(flags);
      return fn(args);
    }
    return value ?? defaultValue;
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

  icon(args: {
    index: number;
    total: number;
    action: t.LabelAction;
    selected?: boolean;
    enabled?: boolean;
    focused?: boolean;
    editing?: boolean;
  }) {
    const { index, total, action } = args;
    const { enabled, selected, focused, editing } = Wrangle.valuesOrDefault(args);

    if (!action.element) {
      return Wrangle.defaultIcon(args);
    }

    if (typeof action.element === 'function') {
      const color = Wrangle.foreColor(args);
      const el = action.element({
        index,
        total,
        enabled,
        selected,
        focused,
        editing,
        color,
      });
      return el ?? Wrangle.defaultIcon(args);
    }

    return;
  },

  defaultIcon(args: { selected?: boolean }) {
    const color = Wrangle.foreColor(args);
    return <Icons.Repo size={18} color={color} offset={[0, 1]} />;
  },
} as const;
