import { COLORS, DEFAULTS, type t } from './common';
import { ItemIcon } from './ui.Item.Icon';

export const Wrangle = {
  value(props: t.CrdtNamespaceItemProps) {
    const value = props.namespace;
    const hasValue = Boolean(value);
    return { value, hasValue };
  },

  foreColor(props: t.CrdtNamespaceItemProps) {
    const { selected = DEFAULTS.selected } = props;
    return selected ? COLORS.WHITE : COLORS.DARK;
  },

  leftIcon(props: t.CrdtNamespaceItemProps) {
    const { editing = DEFAULTS.editing } = props;
    const { hasValue } = Wrangle.value(props);
    const foreColor = Wrangle.foreColor(props);
    let opacity = 0.5;
    if (hasValue) opacity = 1;
    if (editing) opacity = 1;
    return <ItemIcon kind={editing ? 'Editing' : 'Repo'} color={foreColor} opacity={opacity} />;
  },
};
