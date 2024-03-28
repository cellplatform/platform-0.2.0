import { Color, COLORS, DEFAULTS, TextInput, css, type t } from './common';
import { HintKey } from './ui.HintKey';

export const View: React.FC<t.CommandBarProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    focusOnReady = DEFAULTS.focusOnReady,
    placeholder = DEFAULTS.commandPlaceholder,
  } = props;
  const hintKeys = wrangle.hintKeys(props);
  const hasHintKeys = hintKeys.length > 0;

  /**
   * Render
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
    textbox: css({ boxSizing: 'border-box', Padding: [7, 7], display: 'grid' }),
    hintKeys: {
      base: css({ paddingLeft: 6, paddingRight: 6, display: 'grid', placeItems: 'center' }),
      inner: css({ Flex: 'x-center-center' }),
    },
  };

  const elTextbox = (
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

  const elHintKeys =
    enabled && hasHintKeys && hintKeys.map((key, i) => <HintKey key={i} text={key} />);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>{elTextbox}</div>
      {elHintKeys && (
        <div {...styles.hintKeys.base}>
          <div {...styles.hintKeys.inner}>{elHintKeys}</div>
        </div>
      )}
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  hintKeys(props: t.CommandBarProps) {
    if (!props.hintKey) return [];
    return Array.isArray(props.hintKey) ? props.hintKey : [props.hintKey];
  },
};
