import { css, Pkg, t } from '../common';

export type FooterProps = {
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Padding: [8, 10],
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }),
    left: css({
      display: 'grid',
      justifyContent: 'start',
    }),
    right: css({
      display: 'grid',
      justifyContent: 'end',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}></div>
      <div {...styles.right}>{`${Pkg.name}@${Pkg.version}`}</div>
    </div>
  );
};
