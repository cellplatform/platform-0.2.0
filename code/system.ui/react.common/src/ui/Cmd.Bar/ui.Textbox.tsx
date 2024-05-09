import { COLORS, Color, DEFAULTS, TextInput, type t } from './common';

export const Textbox: React.FC<t.CmdBarProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    focusOnReady = DEFAULTS.focusOnReady,
    placeholder = DEFAULTS.commandPlaceholder,
  } = props;

  return (
    <TextInput
      value={props.text}
      placeholder={placeholder}
      placeholderStyle={{
        opacity: 0.4,
        color: COLORS.WHITE,
        fontFamily: 'sans-serif',
        disabledColor: Color.alpha(COLORS.WHITE, 0.5),
      }}
      valueStyle={{
        color: COLORS.WHITE,
        fontFamily: 'monospace',
        fontWeight: 'normal',
        fontSize: 16,
        disabledColor: COLORS.WHITE,
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
