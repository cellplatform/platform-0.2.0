import { COLORS, Color, css, type t } from './common';

export type ShellDividerProps = { style?: t.CssValue };
export const ShellDivider: React.FC<ShellDividerProps> = (props) => {
  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: 'auto 1fr auto 1fr auto',
      columnGap: '5px',
      minHeight: 70,
      userSelect: 'none',
    }),
    divider: {
      base: css({ display: 'grid', alignContent: 'center' }),
      inner: css({ borderTop: `dashed 1px ${Color.alpha(COLORS.DARK, 0.3)}` }),
    },
  };

  const div = (
    <div {...styles.divider.base}>
      <div {...styles.divider.inner} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {'↓'}
      {div}
      {'🐚'}
      {div}
      {'↑'}
    </div>
  );
};
