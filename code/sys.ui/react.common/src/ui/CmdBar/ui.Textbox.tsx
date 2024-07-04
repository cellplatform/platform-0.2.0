import { useEffect, useState } from 'react';
import { Args, DEFAULTS, TextInput, type t } from './common';

export type TextboxProps = Omit<t.CmdBarProps, 'theme' | 'ctrl'> & {
  ctrl: t.CmdBarCtrl;
  theme: t.ColorTheme;
};

export const Textbox: React.FC<TextboxProps> = (props) => {
  const { ctrl } = props;
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

  const handleKeydown: t.TextInputKeyHandler = (e) => {
    props.onKeyDown?.(e);
    if (e.key === 'Enter') ctrl?.invoke('Invoke', {});
  };

  /**
   * Listeners
   */
  useEffect(() => {
    const events = ctrl?.events();

    if (events) {
      events.on('Focus', (e) => textbox?.focus(e.params.select));
      events.on('Blur', (e) => textbox?.blur());
      events.on('SelectAll', (e) => textbox?.selectAll());
      events.on('CaretToStart', (e) => textbox?.caretToStart());
      events.on('CaretToEnd', (e) => textbox?.caretToEnd());
    }

    return events?.dispose;
  }, [ctrl, textbox]);

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
      onKeyDown={handleKeydown}
      onKeyUp={props.onKeyUp}
      onSelect={props.onSelect}
      onReady={(e) => {
        const textbox = e.ref;
        setTextbox(textbox);
        props.onReady?.({ ctrl, textbox });
      }}
    />
  );
};
