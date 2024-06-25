import { useEffect, useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { DEFAULTS, TextInput, type t } from './common';

export type TextboxProps = Omit<t.CmdBarProps, 'theme'> & {
  theme: t.ColorTheme;
};

export const Textbox: React.FC<TextboxProps> = (props) => {
  const [textbox, setTextbox] = useState<t.TextInputRef>();

  /**
   * Listeners
   */
  useEffect(() => {
    const events = props.control?.events();

    if (events) {
      events.on('Focus', (e) => textbox?.focus(e.params.select));
      events.on('Blur', (e) => textbox?.blur());
      events.on('SelectAll', (e) => textbox?.selectAll());
      events.on('CaretToStart', (e) => textbox?.caretToStart());
      events.on('CaretToEnd', (e) => textbox?.caretToEnd());
    }

    return events?.dispose;
  }, [props.control, textbox]);

  const {
    theme,
    enabled = DEFAULTS.enabled,
    focusOnReady = DEFAULTS.focusOnReady,
    placeholder = DEFAULTS.commandPlaceholder,
  } = props;

  const color = theme.fg;
  return (
    <TextInput
      value={props.text}
      theme={theme.name}
      placeholder={placeholder}
      placeholderStyle={{
        opacity: 0.4,
        color,
        fontFamily: 'sans-serif',
        disabledColor: theme.alpha(0.5).fg,
      }}
      valueStyle={{
        color,
        fontFamily: 'monospace',
        fontWeight: 'normal',
        fontSize: 16,
        disabledColor: color,
      }}
      isEnabled={enabled}
      spellCheck={false}
      autoCorrect={false}
      autoCapitalize={false}
      focusOnReady={focusOnReady}
      selectOnReady={focusOnReady}
      onFocusChange={props.onFocusChange}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      onSelect={props.onSelect}
      onReady={(e) => {
        props.onReady?.(e);
        setTextbox(e.ref);
      }}
    />
  );
};
