import { Color, DEFAULTS, TextInput, css, type t } from './common';

import { Wrangle } from './Wrangle';

export const ItemLabel: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    editing = DEFAULTS.editing,
    selected = DEFAULTS.selected,
    maxLength = DEFAULTS.maxLength,
  } = props;
  const { value } = Wrangle.value(props);
  const color = Wrangle.foreColor(props);
  const underlineColor = Color.alpha(color, selected ? 0.5 : 0.2);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    textbox: css({}),
    underline: css({
      pointerEvents: 'none',
      borderBottom: `dashed 1.2px ${underlineColor}`,
      Absolute: [null, 0, 0, -3],
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {editing && <div {...styles.underline} />}
      <TextInput
        style={styles.textbox}
        placeholder={'namespace'}
        placeholderStyle={{
          opacity: 0.3,
          color: color,
          disabledColor: color,
        }}
        value={value}
        valueStyle={{
          fontSize: 13,
          color: color,
          disabledColor: color,
        }}
        maxLength={maxLength}
        spellCheck={false}
        isEnabled={enabled}
        isReadOnly={!editing}
        onChanged={(e) => props.onChange?.({ text: e.to })}
      />
    </div>
  );
};
