import { Color, css, type t } from './common';

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
      gridTemplateColumns: `1fr 1fr 1fr`,
      columnGap: '10px',
    }),
    edge: css({
      position: 'relative',
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 1.6,
      Padding: [3, 12],
    }),
    left: css({}),
    right: css({}),

    title: css({ opacity: isFocused ? 0.3 : 0.15 }),
    cmd: css({ opacity: isFocused ? 0.3 : 0.15 }),
    cmdLast: css({ opacity: isFocused ? 1 : 0.15 }),
    paramList: css({}),
    param: css({ opacity: isFocused ? 0.3 : 0.15 }),

    border: {
      base: css({
        Absolute: [-20, null, -20, null],
        pointerEvents: 'none',
        borderLeft: `dashed 1px ${Color.alpha(theme.fg, isFocused ? 0.3 : 0.2)}`,
      }),
      left: css({ right: 0 }),
      right: css({ left: 0 }),
    },
  };

  const pos = args._.filter((cmd) => !!cmd);
  const elCmdList = pos.map((cmd, i) => {
    const isLast = i === pos.length - 1;
    const style = css(styles.cmd, isLast ? styles.cmdLast : undefined);
    return (
      <div key={`${cmd}.${i}`} {...style}>
        <span>{`${isLast ? '→' : '↓'} `}</span>
        <span>{cmd}</span>
      </div>
    );
  });

  const elParamList = Object.entries(args)
    .filter(([key]) => key !== '_')
    .map(([key, value]) => {
      const text = `${key}${!!value ? ': ' : ''}${value}`;
      return (
        <div key={key} {...styles.param}>
          <span>{text}</span>
        </div>
      );
    });

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.left, styles.edge)}>
        <div {...css(styles.border.base, styles.border.left)} />
        {elCmdList.length > 0 && <div {...styles.title}>{`command:`}</div>}
        {elCmdList}
      </div>
      <div></div>
      <div {...css(styles.right, styles.edge)}>
        <div {...css(styles.border.base, styles.border.right)} />
        <div {...styles.paramList}>
          {elParamList.length > 0 && <div {...styles.title}>{`params:`}</div>}
          {elParamList}
        </div>
      </div>
    </div>
  );
};