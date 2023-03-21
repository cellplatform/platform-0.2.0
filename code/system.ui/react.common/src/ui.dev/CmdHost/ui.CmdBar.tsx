import { useState } from 'react';

import { COLORS, css, t, TextInput } from './common';
import { useKeyboard } from './useKeyboard.mjs';
import { CmdBarPlaceholder } from './ui.CmdBar.Placeholder';

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
      Padding: [7, 7],
      color: COLORS.WHITE,
      backgroundColor: COLORS.DARK,
    }),
    textbox: css({}),
  };

  const elPlaceholder = <CmdBarPlaceholder />;

  return (
    <div {...css(styles.base, props.style)}>
      <TextInput
        style={styles.textbox}
        value={props.text}
        placeholder={elPlaceholder}
        placeholderStyle={{ opacity: 1, color: COLORS.WHITE }}
        valueStyle={{
          color: COLORS.WHITE,
          fontFamily: 'monospace',
          fontWeight: 'normal',
          fontSize: 16,
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
