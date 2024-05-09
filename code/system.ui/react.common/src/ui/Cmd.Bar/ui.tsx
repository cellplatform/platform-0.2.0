import { COLORS, DEFAULTS, css, type t } from './common';
import { HintKey } from './ui.HintKey';
import { Textbox } from './ui.Textbox';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;
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
    <div {...styles.textbox}>
      <Textbox {...props} />
    </div>
  );

  const elHintKeys =
    enabled && hasHintKeys && hintKeys.map((key, i) => <HintKey key={i} text={key} />);

  return (
    <div {...css(styles.base, props.style)}>
      {elTextbox}
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
  hintKeys(props: t.CmdBarProps) {
    if (!props.hintKey) return [];
    return Array.isArray(props.hintKey) ? props.hintKey : [props.hintKey];
  },
};
