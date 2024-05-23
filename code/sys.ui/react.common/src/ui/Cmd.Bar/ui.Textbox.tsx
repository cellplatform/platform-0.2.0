import { DEFAULTS, TextInput, type t } from './common';

export type TextboxProps = Omit<t.CmdBarProps, 'theme'> & {
  theme: t.ColorTheme;
};

export const Textbox: React.FC<TextboxProps> = (props) => {
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
      onReady={props.onReady}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
    />
  );
};
