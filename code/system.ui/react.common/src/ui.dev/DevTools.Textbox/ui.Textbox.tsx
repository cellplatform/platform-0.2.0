import { useEffect, useState, useRef } from 'react';

import { COLORS, Color, css, FC, TextInput, t } from '../common';
import { Button } from '../DevTools.Button';

const DEFAULT = {
  isEnabled: true,
  placeholder: 'enter text...',
};

type StringOrNil = string | undefined | null;
type ContentInput = StringOrNil | JSX.Element;

export type TextboxProps = {
  isEnabled?: boolean;
  label?: ContentInput;
  value?: StringOrNil;
  placeholder?: ContentInput;
  right?: ContentInput;
  style?: t.CssValue;
  labelOpacity?: number;
  onChange?: t.TextInputChangeEventHandler;
  onEnter?: t.TextInputKeyEventHandler;
};

const View: React.FC<TextboxProps> = (props) => {
  const isActive = Wrangle.isActive(props);
  const [isFocused, setFocused] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      userSelect: 'none',
      color: COLORS.DARK,
    }),
    title: css({
      fontSize: 12,
      color: Color.alpha(COLORS.DARK, 0.7),
      marginBottom: 5,
      opacity: isActive ? 1 : 0.4,
    }),
    body: css({
      borderBottom: `solid 1px`,
      borderBottomColor:
        isActive && isFocused ? Color.alpha(COLORS.CYAN, 1) : Color.alpha(COLORS.DARK, 0.1),
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    input: css({
      boxSizing: 'border-box',
      PaddingX: 5,
      PaddingY: 3,
      display: 'grid',
      height: 26,
    }),
    right: css({
      display: 'grid',
      placeItems: 'center',
      height: 26,
    }),
  };

  const elInput = (
    <div {...styles.input}>
      <TextInput
        isEnabled={isActive}
        value={Wrangle.value(props)}
        placeholder={Wrangle.placeholder(props)}
        placeholderStyle={{ opacity: 0.2, italic: true }}
        focusAction={'Select'}
        spellCheck={false}
        onFocusChange={(e) => setFocused(e.isFocused)}
        onChanged={(e) => {
          if (isActive) props.onChange?.(e);
        }}
        onEnter={(e) => {
          if (isActive) props.onEnter?.(e);
        }}
      />
    </div>
  );

  const elRight = <div {...styles.right}>{props.right}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {props.label && <div {...styles.title}>{props.label}</div>}
      <div {...styles.body}>
        {elInput}
        {elRight}
      </div>
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  isActive(props: TextboxProps): boolean {
    const { isEnabled = DEFAULT.isEnabled } = props;
    if (!isEnabled) return false;
    return true;
  },

  value(props: TextboxProps) {
    return props.value ?? '';
  },

  placeholder(props: TextboxProps) {
    if (props.placeholder === null) return '';
    return props.placeholder ?? DEFAULT.placeholder;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULT;
  isActive: typeof Wrangle.isActive;
};
export const Textbox = FC.decorate<TextboxProps, Fields>(
  View,
  { DEFAULT, isActive: Wrangle.isActive },
  { displayName: 'Textbox' },
);
