import { useEffect, useState } from 'react';
import { Ctrl } from '../CmdBar.Ctrl';
import { Color, DEFAULTS, Immutable, KeyHint, css, type t } from './common';
import { Textbox } from './ui.Textbox';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled = DEFAULTS.enabled, focusBorder = DEFAULTS.focusBorder } = props;
  const [ctrl, setCtrl] = useState<t.CmdBarCtrl>();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (props.cmd) setCtrl(Ctrl.toCtrl(props.cmd));
  }, [props.cmd]);

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
    focused: css({
      Absolute: [0, 0, null, 0],
      height: 1.5,
      pointerEvents: 'none',
      backgroundColor: Color.BLUE,
      opacity: focused && focusBorder ? 1 : 0,
      transition: `opacity 50ms`,
    }),
  };

  const elTextbox = (
    <div {...styles.textbox}>
      <Textbox
        {...props}
        ctrl={ctrl}
        enabled={enabled}
        theme={theme}
        opacity={enabled ? 1 : 0.3}
        onFocusChange={(e) => {
          setFocused(e.is.focused);
          props.onFocusChange?.(e);
        }}
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
      <div {...styles.focused} />
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
    if (!props.cmd) return Ctrl.create(Immutable.clonerRef({}))._;
    return props.cmd;
  },
} as const;
