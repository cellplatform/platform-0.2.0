import { useEffect, useState } from 'react';
import { css, Args, DEFAULTS, TextInput, type t } from './common';

export type TextboxProps = Omit<t.CmdBarProps, 'theme' | 'ctrl'> & {
  ctrl: t.CmdBarCtrlMethods;
  theme: t.ColorTheme;
  opacity?: number;
};

export const Textbox: React.FC<TextboxProps> = (props) => {
  const {
    ctrl,
    theme,
    text = '',
    enabled = DEFAULTS.enabled,
    focusOnReady = DEFAULTS.focusOnReady,
    placeholder = DEFAULTS.commandPlaceholder,
  } = props;

  const [ready, setReady] = useState(false);
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
    if (e.key === 'Enter') ctrl?.invoke({ text });
  };

  /**
   * Listeners
   */
  useEffect(() => {
    const events = ctrl.cmd.events();
    if (events) {
      events.on('Focus', (e) => textbox?.focus(e.params.select));
      events.on('Blur', (e) => textbox?.blur());
      events.on('SelectAll', (e) => textbox?.selectAll());
      events.on('CaretToStart', (e) => textbox?.caretToStart());
      events.on('CaretToEnd', (e) => textbox?.caretToEnd());
    }
    return events?.dispose;
  }, [ctrl, textbox]);

  useEffect(() => {
    if (ready || !textbox) return;
    setReady(true);
    props.onReady?.({ ctrl, textbox });
  }, [textbox, ctrl, ready]);

  /**
   * Render
   */
  const color = theme.fg;
  const styles = {
    base: css({ opacity: props.opacity ?? 1 }),
  };

  return (
    <TextInput
      style={styles.base}
      value={text}
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
      onReady={(e) => setTextbox(e.ref)}
    />
  );
};
