import { useEffect, useState } from 'react';
import { DEFAULTS, TextInput, type t, Args } from './common';

export type TextboxProps = Omit<t.CmdBarProps, 'theme'> & {
  theme: t.ColorTheme;
};

export const Textbox: React.FC<TextboxProps> = (props) => {
  const [textbox, setTextbox] = useState<t.TextInputRef>();

  /**
   * Handlers
   */
  const handleChange: t.TextInputChangeHandler = (e) => {
    let _parsed: t.ParsedArgs;
    props.onChange?.({
      ...e,
      get parsed() {
        return _parsed || (_parsed = Args.parse(e.to));
      },
    });
  };

  /**
   * Listeners
   */
  useEffect(() => {
    const events = props.ctrl?.events();

    if (events) {
      events.on('Focus', (e) => textbox?.focus(e.params.select));
      events.on('Blur', (e) => textbox?.blur());
      events.on('SelectAll', (e) => textbox?.selectAll());
      events.on('CaretToStart', (e) => textbox?.caretToStart());
      events.on('CaretToEnd', (e) => textbox?.caretToEnd());
    }

    return events?.dispose;
  }, [props.ctrl, textbox]);

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
      onChange={handleChange}
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
