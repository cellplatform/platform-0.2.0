import { COLORS, Color, Icons, css, type t } from './common';

export type StatusbarProps = {
  left?: string | JSX.Element;
  right?: string | JSX.Element;
  style?: t.CssValue;
};

export const Statusbar: React.FC<StatusbarProps> = (props) => {
  /**
   * Render
   */
  const color = COLORS.WHITE;
  const styles = {
    base: css({
      padding: 6,
      fontSize: 12,
      backgroundColor: Color.alpha(COLORS.GREEN, 0.8),
      color,
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
    }),
    label: css({ Flex: 'x-center-center' }),
    ellipsis: css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
    mono: css({ fontFamily: 'monospace', fontSize: 10, paddingTop: 2 }),
    sans: css({ paddingTop: 1 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.sans, styles.ellipsis)}>{props.left}</div>
      <div {...css(styles.label, styles.ellipsis)}>
        <span {...css(styles.mono)}>{props.right}</span>
        <Icons.Database size={15} margin={[0, 0, 0, 4]} />
        <Icons.Antenna size={15} margin={[0, 0, 0, 10]} />
      </div>
    </div>
  );
};
