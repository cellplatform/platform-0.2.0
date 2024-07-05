import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type MainArgsProps = {
  args?: t.ParsedArgs;
  isFocused?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const MainArgs: React.FC<MainArgsProps> = (props) => {
  const { args, isFocused } = props;

  if (!args) return null;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      gridTemplateColumns: `auto 1fr auto`,
      columnGap: '10px',
    }),
    edge: css({
      position: 'relative',
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 1.6,
    }),
    left: css({ paddingLeft: 10, paddingRight: 30 }),
    right: css({ paddingLeft: 30, paddingRight: 10 }),

    cmd: css({ opacity: isFocused ? 0.3 : 0.15 }),
    cmdLast: css({ opacity: isFocused ? 1 : 0.15 }),
    param: css({ opacity: isFocused ? 0.3 : 0.15 }),

    border: {
      base: css({
        Absolute: [-20, null, -20, null],
        pointerEvents: 'none',
        borderLeft: `dashed 1px ${Color.alpha(theme.fg, isFocused ? 0.15 : 0.08)}`,
      }),
      left: css({ right: 0 }),
      right: css({ left: 0 }),
    },
  };

  const elCmdList = args._.map((cmd, i) => {
    const isLast = i === args._.length - 1;
    const style = css(styles.cmd, isLast ? styles.cmdLast : undefined);
    return (
      <div key={`${cmd}.${i}`} {...style}>
        {cmd}
      </div>
    );
  });

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.left, styles.edge)}>
        <div {...css(styles.border.base, styles.border.left)} />
        {elCmdList}
      </div>
      <div></div>
      <div {...css(styles.right, styles.edge)}>
        <div {...css(styles.border.base, styles.border.right)} />
        <div {...styles.param}>{`--param`}</div>
      </div>
    </div>
  );
};
