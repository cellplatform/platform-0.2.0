import { DEFAULTS, TextInput, css, type t } from './common';

import { Wrangle } from './Wrangle';

export const ItemLabel: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    editing = DEFAULTS.editing,
    maxLength = DEFAULTS.maxLength,
  } = props;
  const foreColor = Wrangle.foreColor(props);
  const { value } = Wrangle.value(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    textbox: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
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
    </div>
  );
};
