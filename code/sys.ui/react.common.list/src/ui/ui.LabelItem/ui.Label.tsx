import { RefObject } from 'react';
import { Wrangle } from './Wrangle';
import { COLORS, DEFAULTS, TextInput, css, type t } from './common';

type Props = t.LabelItemProps & {
  inputRef: RefObject<t.TextInputRef>;
  onDoubleClick?: React.MouseEventHandler;
  debug?: boolean;
};

export const Label: React.FC<Props> = (props) => {
  const {
    inputRef,
    index = DEFAULTS.index,
    total = DEFAULTS.total,
    maxLength = DEFAULTS.maxLength,
    focusOnReady = DEFAULTS.focusOnReady,
    focused = DEFAULTS.focused,
    selected = DEFAULTS.selected,
    editing = DEFAULTS.editing,
    renderers = DEFAULTS.renderers,
    item = {},
    debug,
  } = props;
  const { enabled = DEFAULTS.enabled, placeholder = DEFAULTS.placeholder } = item;
  const label = item.label || '';

  /**
   * Render
   */
  const color = Wrangle.foreColor(props);
  const fontSize = 13;
  const valueStyle = { fontSize, color, disabledColor: color };
  const placeholderStyle = { ...valueStyle, opacity: selected && focused ? 0.5 : 0.3 };
  const styles = {
    base: css({
      position: 'relative',
      color,
      height: 20,
      cursor: 'default',
      boxSizing: 'border-box',
      display: 'grid',
      backgroundColor: debug ? DEFAULTS.RUBY : undefined,
      caretColor: editing && focused ? COLORS.WHITE : COLORS.BLUE,
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
    labelEmpty: css({
      opacity: placeholderStyle.opacity,
    }),
  };

  const renderElement = (renderer?: t.LabelItemRender, text?: string) => {
    if (typeof renderer === 'function') {
      const fn = Wrangle.render.element;
      const res = fn(renderer, { index, total, enabled, selected, focused, editing, item });
      if (res !== undefined) return res;
    }
    return text;
  };

  const elTextbox = editing && (
    <TextInput
      ref={inputRef}
      value={label}
      placeholder={renderElement(renderers.placeholder, placeholder)}
      valueStyle={valueStyle}
      placeholderStyle={placeholderStyle}
      maxLength={maxLength}
      spellCheck={false}
      isEnabled={enabled}
      isReadOnly={!editing}
      focusOnReady={focusOnReady}
      focusAction={'Select'}
      onChange={(e) => props.onEditChange?.({ label: e.to, position: { index, total } })}
      onKeyDown={(e) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
          // Cancel [↑↓] arrow keys.
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    />
  );

  const elLabelBody = !editing && renderElement(renderers.label, label);

  const elLabel = !editing && (
    <div {...css(styles.label, !elLabelBody && styles.labelEmpty)}>
      {elLabelBody || renderElement(renderers.placeholder, placeholder)}
    </div>
  );

  return (
    <div {...styles.base} onDoubleClick={props.onDoubleClick}>
      {elTextbox}
      {elLabel}
    </div>
  );
};
