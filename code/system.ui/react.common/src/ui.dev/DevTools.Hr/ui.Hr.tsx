import { Color, css, t } from '../common';

export type HrProps = {
  marginY?: number;
  style?: t.CssValue;
};
export const Hr: React.FC<HrProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      border: 'none',
      borderTop: `solid 1px ${Color.format(-0.1)}`,
      MarginY: props.marginY ?? 10,
    }),
  };
  return <div {...css(styles.base, props.style)} />;
};
