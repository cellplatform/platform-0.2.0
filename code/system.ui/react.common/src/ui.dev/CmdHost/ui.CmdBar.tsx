import { useState } from 'react';

import { COLORS, css, DevIcons, t, TextInput } from './common';
import { useKeyboard } from './useKeyboard.mjs';

export type CmdBarProps = {
  text?: string;
  style?: t.CssValue;
  onChanged?: t.TextInputChangeEventHandler;
};

export const CmdBar: React.FC<CmdBarProps> = (props) => {
  const [textboxRef, setTextboxRef] = useState<t.TextInputRef>();
  const [isFocused, setFocused] = useState(false);

  useKeyboard(textboxRef);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      Padding: [7, 5],
      color: COLORS.WHITE,
      backgroundColor: COLORS.DARK,

      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 3,
    }),
    icon: css({
      opacity: isFocused ? 1 : 0.3,
      filter: `grayscale(${isFocused && Boolean(props.text) ? 0 : 100}%)`,
      transition: 'all 150ms ease',
    }),
    textbox: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <DevIcons.Command style={styles.icon} color={COLORS.CYAN} size={20} />
      <TextInput
        style={styles.textbox}
        value={props.text}
        placeholder={'command'}
        placeholderStyle={{ opacity: 0.3, color: COLORS.WHITE }}
        valueStyle={{
          color: COLORS.WHITE,
          fontFamily: 'monospace',
          fontWeight: 'normal',
          fontSize: 14,
        }}
        onReady={(ref) => setTextboxRef(ref)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChanged={props.onChanged}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize={false}
      />
    </div>
  );
};
