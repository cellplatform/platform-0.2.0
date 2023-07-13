import { COLORS, DEFAULTS, type t } from './common';

export const Wrangle = {
  text(props: t.LabelItemProps) {
    const text = props.text || '';
    const hasValue = Boolean(text.trim());
    const isEmpty = !hasValue;
    return { text, hasValue, isEmpty };
  },

  foreColor(props: t.LabelItemProps) {
    const { selected = DEFAULTS.selected } = props;
    return selected ? COLORS.WHITE : COLORS.DARK;
  },
};
