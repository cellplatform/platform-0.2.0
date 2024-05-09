import { COLORS, DEFAULTS, css, type t } from './common';
import { HintKeys } from './ui.HintKeys';
import { Textbox } from './ui.Textbox';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.DARK,
      color: COLORS.WHITE,
      userSelect: 'none',
    }),
    grid: css({ display: 'grid', gridTemplateColumns: wrangle.columns(props) }),
    textbox: css({ boxSizing: 'border-box', Padding: [7, 7], display: 'grid' }),
  };

  const elTextbox = (
    <div {...styles.textbox}>
      <Textbox {...props} enabled={enabled} />
    </div>
  );

  const elHintKeys = <HintKeys {...props} enabled={enabled} />;

  return (
    <div {...css(styles.base, styles.grid, props.style)}>
      {props.prefix}
      {elTextbox}
      {elHintKeys}
      {props.suffix}
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  columns(props: t.CmdBarProps) {
    let res = '1fr auto';
    if (props.prefix) res = `auto ${res}`;
    if (props.suffix) res = `${res} auto`;
    return res;
  },
} as const;
