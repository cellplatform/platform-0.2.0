import { DEFAULTS, css, type t } from './common';
import { HintKey } from './ui.HintKey';

export type HintKeyProps = Omit<t.CmdBarProps, 'theme'> & {
  theme: t.ColorTheme;
};

export const HintKeys: React.FC<HintKeyProps> = (props) => {
  const { theme, enabled = DEFAULTS.enabled } = props;
  const hintKeys = wrangle.hintKeys(props);
  const hasHintKeys = enabled && hintKeys.length > 0;
  if (!hasHintKeys) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      paddingLeft: 6,
      paddingRight: 6,
      display: 'grid',
      placeItems: 'center',
    }),
    inner: css({ Flex: 'x-center-center' }),
  };

  const elKeys = hintKeys.map((key, i) => <HintKey key={i} text={key} theme={theme} />);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>{elKeys}</div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  hintKeys(props: HintKeyProps) {
    if (!props.hintKey) return [];
    return Array.isArray(props.hintKey) ? props.hintKey : [props.hintKey];
  },
};
