import { COLORS, DEFAULTS, type t, Icons } from './common';

export const Wrangle = {
  labelText(args: { label?: string }) {
    const text = args.label || '';
    const hasValue = Boolean(text.trim());
    const isEmpty = !hasValue;
    return { text, hasValue, isEmpty };
  },

  foreColor(args: { selected?: boolean }) {
    const { selected = DEFAULTS.selected } = args;
    return selected ? COLORS.WHITE : COLORS.DARK;
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
