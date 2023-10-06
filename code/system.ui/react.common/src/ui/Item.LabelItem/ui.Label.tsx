import { RefObject } from 'react';
import { Wrangle } from './Wrangle';
import { Color, DEFAULTS, TextInput, css, type t } from './common';

type Props = t.LabelItemProps & {
  inputRef: RefObject<t.TextInputRef>;
  onDoubleClick?: React.MouseEventHandler;
  debug?: boolean;
};

export const Label: React.FC<Props> = (props) => {
  const {
    inputRef,
    enabled = DEFAULTS.enabled,
    editing = DEFAULTS.editing,
    selected = DEFAULTS.selected,
    maxLength = DEFAULTS.maxLength,
    placeholder = DEFAULTS.placeholder,
    focusOnReady = DEFAULTS.focusOnReady,
    debug,
  } = props;
  const label = Wrangle.labelText(props);

  /**
   * [Render]
   */
  const color = Wrangle.foreColor(props);
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
      backgroundColor: debug ? DEFAULTS.RUBY : undefined,
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
  };

  const elTextbox = editing && (
    <TextInput
      ref={inputRef}
      value={label.text}
      placeholder={placeholder}
      valueStyle={valueStyle}
      placeholderStyle={placeholderStyle}
      maxLength={maxLength}
      spellCheck={false}
      isEnabled={enabled}
      isReadOnly={!editing}
      focusOnReady={focusOnReady}
      focusAction={'Select'}
      onChanged={(e) => props.onEditChange?.({ label: e.to })}
    />
  );

  const labelText = label.isEmpty ? placeholder : label.text;
  const elLabel = !editing && (
    <div {...css(styles.label, label.isEmpty && styles.labelEmpty)}>{labelText}</div>
  );

  return (
    <div {...styles.base} onDoubleClick={props.onDoubleClick}>
      {elTextbox}
      {elLabel}
    </div>
  );
};
