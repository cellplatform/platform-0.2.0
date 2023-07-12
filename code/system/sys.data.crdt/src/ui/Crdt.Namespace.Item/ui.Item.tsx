import { COLORS, DEFAULTS, FC, Style, TextInput, css, type t } from './common';
import { ItemIcon } from './ui.Item.Icon';

export const Item: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    selected = DEFAULTS.selected,
    editing = DEFAULTS.editing,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    maxLength = DEFAULTS.maxLength,
  } = props;
  const { value, hasValue } = Wrangle.value(props);

  /**
   * [Render]
   */
  const foreColor = selected ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: selected ? COLORS.BLUE : undefined,
      boxSizing: 'border-box',
      ...Style.toPadding(props.padding ?? padding),
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    right: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: 5,
    }),
    textbox: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {Wrangle.leftIcon(props)}
        <TextInput
          style={styles.textbox}
          placeholder={'namespace'}
          placeholderStyle={{
            opacity: 0.3,
            color: foreColor,
            disabledColor: foreColor,
          }}
          value={value}
          valueStyle={{
            fontSize: 13,
            color: foreColor,
            disabledColor: foreColor,
          }}
          maxLength={maxLength}
          spellCheck={false}
          isEnabled={enabled}
          isReadOnly={!editing}
          onChanged={(e) => props.onChange?.({ namespace: e.to })}
        />
        <div {...styles.right}>
          <ItemIcon kind={'Json'} color={foreColor} />
          <ItemIcon kind={'ObjectTree'} color={foreColor} />
        </div>
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
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
