import { RefObject } from 'react';
import { Wrangle } from './Wrangle';
import { Color, DEFAULTS, TextInput, css, type t } from './common';

type Props = t.CrdtNamespaceItemProps & { inputRef: RefObject<t.TextInputRef> };

export const Label: React.FC<Props> = (props) => {
  const {
    inputRef,
    enabled = DEFAULTS.enabled,
    editing = DEFAULTS.editing,
    selected = DEFAULTS.selected,
    maxLength = DEFAULTS.maxLength,
    focusOnReady = DEFAULTS.focusOnReady,
  } = props;
  const { text, isEmpty } = Wrangle.text(props);
  const placeholder = DEFAULTS.placeholder;

  /**
   * [Render]
   */
  const color = Wrangle.foreColor(props);
  const underlineColor = Color.alpha(color, selected ? 0.5 : 0.2);
  const fontSize = 13;
  const valueStyle = { fontSize, color, disabledColor: color };
  const placeholderStyle = { ...valueStyle, opacity: 0.3 };
  const styles = {
    base: css({
      position: 'relative',
      color,
      height: 20,
      cursor: 'default',
      boxSizing: 'border-box',
      display: 'grid',
    }),
    label: css({
      color,
      fontSize,
      boxSizing: 'border-box',
      alignSelf: 'center',
      userSelect: 'none',
      marginLeft: 2,
      marginTop: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    labelEmpty: css({ opacity: placeholderStyle.opacity }),
    underline: css({
      pointerEvents: 'none',
      borderBottom: `dashed 1.2px ${underlineColor}`,
      Absolute: [null, 0, 0, -3],
    }),
  };

  const elTextbox = editing && (
    <TextInput
      ref={inputRef}
      value={text}
      placeholder={placeholder}
      valueStyle={valueStyle}
      placeholderStyle={placeholderStyle}
      maxLength={maxLength}
      spellCheck={false}
      isEnabled={enabled}
      isReadOnly={!editing}
      focusOnReady={focusOnReady}
      onChanged={(e) => props.onChange?.({ text: e.to })}
      onEnter={(e) => props.onEnter?.({ text })}
    />
  );

  const labelText = isEmpty ? placeholder : text;
  const elLabel = !editing && (
    <div {...css(styles.label, isEmpty && styles.labelEmpty)}>{labelText}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {editing && <div {...styles.underline} />}
      {elTextbox}
      {elLabel}
    </div>
  );
};
