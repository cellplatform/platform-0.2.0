import { useRef } from 'react';
import { Ctrl } from './Root.ctrl';
import { Color, DEFAULTS, Immutable, KeyHint, css, type t } from './common';
import { Is } from './u.Is';
import { Textbox } from './ui.Textbox';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;

  const ctrlRef = useRef(wrangle.ctrlCmd(props));
  const ctrl = ctrlRef.current;

  /**
   * Render
   */
  const theme = Color.theme(props.theme ?? 'Dark');
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: theme.bg,
      color: theme.fg,
      userSelect: 'none',
    }),
    grid: css({ display: 'grid', gridTemplateColumns: wrangle.columns(props) }),
    textbox: css({ boxSizing: 'border-box', Padding: [7, 7], display: 'grid' }),
    hintKey: css({ marginRight: 7 }),
  };

  const elTextbox = (
    <div {...styles.textbox}>
      <Textbox {...props} ctrl={ctrl} enabled={enabled} theme={theme} opacity={enabled ? 1 : 0.3} />
    </div>
  );

  const elHintKeys = (
    <KeyHint.Combo
      keys={props.hintKey}
      enabled={enabled}
      theme={theme.name}
      style={styles.hintKey}
    />
  );

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

  ctrlCmd(props: t.CmdBarProps): t.CmdBarCtrlMethods {
    if (!props.ctrl) return Ctrl.create(Immutable.clonerRef({}));
    return Ctrl.withMethods(props.ctrl);
  },
} as const;
