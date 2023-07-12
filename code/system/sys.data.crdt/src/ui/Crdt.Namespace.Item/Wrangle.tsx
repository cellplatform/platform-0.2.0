import { COLORS, DEFAULTS, type t } from './common';
import { Icon } from './ui.Item.Icon';

export const Wrangle = {
  text(props: t.CrdtNamespaceItemProps) {
    const text = props.text || '';
    const hasValue = Boolean(text.trim());
    const isEmpty = !hasValue;
    return { text, hasValue, isEmpty };
  },

  foreColor(props: t.CrdtNamespaceItemProps) {
    const { selected = DEFAULTS.selected } = props;
    return selected ? COLORS.WHITE : COLORS.DARK;
  },

  leftIcon(props: t.CrdtNamespaceItemProps) {
    const { editing = DEFAULTS.editing } = props;
    const { hasValue } = Wrangle.text(props);
    const foreColor = Wrangle.foreColor(props);

    let opacity = 0.5;
    if (hasValue) opacity = 1;
    if (editing) opacity = 1;

    return (
      <Icon
        //
        width={18}
        action={editing ? 'Editing' : 'Repo'}
        color={foreColor}
        opacity={opacity}
      />
    );
  },
};
