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
    mono: css({ fontFamily: 'monospace', fontSize: 10, paddingTop: 2 }),
    span: css({ paddingTop: 1 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.span}>{props.left}</div>
      <div {...styles.label}>
        <span {...styles.mono}>{props.right}</span>
        <Icons.Database size={15} margin={[0, 0, 0, 8]} />
        <Icons.Antenna size={15} margin={[0, 0, 0, 5]} />
      </div>
    </div>
  );
};
