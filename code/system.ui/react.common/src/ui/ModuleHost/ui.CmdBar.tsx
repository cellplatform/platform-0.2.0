import { COLORS, DEFAULTS, TextInput, css, type t } from './common';
import { HintKey } from './ui.HintKey';

export type CmdBarProps = {
  text?: string;
  placeholder?: string;
  style?: t.CssValue;
  hintKey?: string | string[];
  focusOnReady?: boolean;
  onReady?: t.TextInputReadyHandler;
  onChanged?: t.TextInputChangeEventHandler;
  onFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
};

export const CmdBar: React.FC<CmdBarProps> = (props) => {
  const { focusOnReady = DEFAULTS.focusOnReady, placeholder = DEFAULTS.commandPlaceholder } = props;

  const hintKeys = Wrangle.hintKeys(props);
  const hasHintKeys = hintKeys.length > 0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.DARK,
      color: COLORS.WHITE,
      userSelect: 'none',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    textbox: css({
      boxSizing: 'border-box',
      Padding: [7, 7],
    }),
    hintKeys: {
      base: css({ paddingLeft: 6, paddingRight: 6, display: 'grid', placeItems: 'center' }),
      inner: css({ Flex: 'horizontal-center-center' }),
    },
  };

  const elTextbox = (
    <TextInput
      value={props.text}
      placeholder={placeholder}
      placeholderStyle={{
        opacity: 0.3,
        color: COLORS.WHITE,
        fontFamily: 'sans-serif',
      }}
      valueStyle={{
        color: COLORS.WHITE,
        fontFamily: 'monospace',
        fontWeight: 'normal',
        fontSize: 16,
      }}
      spellCheck={false}
      autoCorrect={false}
      autoCapitalize={false}
      focusOnReady={focusOnReady}
      selectOnReady={focusOnReady}
      //
      onFocusChange={props.onFocusChange}
      onReady={props.onReady}
      onChanged={props.onChanged}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
    />
  );

  const elHintKeys = hintKeys.map((key, i) => <HintKey key={i} text={key} />);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>{elTextbox}</div>
      {hasHintKeys && (
        <div {...styles.hintKeys.base}>
          <div {...styles.hintKeys.inner}>{elHintKeys}</div>
        </div>
      )}
    </div>
  );
};

/**
 * [Helpers]
 */
const Wrangle = {
  hintKeys(props: CmdBarProps) {
    if (!props.hintKey) return [];
    return Array.isArray(props.hintKey) ? props.hintKey : [props.hintKey];
  },
};
