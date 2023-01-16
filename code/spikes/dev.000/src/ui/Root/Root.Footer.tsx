import { COLORS, css, Pkg, t } from '../common';

export type FooterProps = {
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const moduleIdentifier = `${Pkg.name}@${Pkg.version}`;
  const href = './index.json';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Padding: [8, 10],
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      cursor: 'default',
    }),
    left: css({
      display: 'grid',
      justifyContent: 'start',
    }),
    right: css({
      display: 'grid',
      justifyContent: 'end',
    }),
    a: css({
      color: COLORS.DARK,
      textDecoration: 'none',
      ':hover': { color: COLORS.BLUE },
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}></div>
      <div {...styles.right}>
        <a {...styles.a} href={href}>
          {moduleIdentifier}
        </a>
      </div>
    </div>
  );
};
