import { useEffect, useState } from 'react';
import { Color, DEFAULTS, Immutable, KeyHint, css, type t } from './common';
import { Ctrl } from '../CmdBar.Ctrl';
import { Textbox } from './ui.Textbox';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;
  const [cmdbar, setCmdbar] = useState<t.CmdBarCtrl>();

  useEffect(() => {
    if (props.ctrl) setCmdbar(Ctrl.cmdbar(props.ctrl));
  }, [props.ctrl]);

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
    grid: css({
      display: 'grid',
      gridTemplateColumns: wrangle.columns(props),
    }),
    textbox: css({
      boxSizing: 'border-box',
      Padding: [7, 7],
      display: 'grid',
    }),
    hintKey: css({ marginRight: 7 }),
  };

  const elTextbox = (
    <div {...styles.textbox}>
      <Textbox
        {...props}
        cmdbar={cmdbar}
        enabled={enabled}
        theme={theme}
        opacity={enabled ? 1 : 0.3}
      />
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

  ctrl(props: t.CmdBarProps) {
    if (!props.ctrl) return Ctrl.create(Immutable.clonerRef({}))._;
    return props.ctrl;
  },
} as const;
