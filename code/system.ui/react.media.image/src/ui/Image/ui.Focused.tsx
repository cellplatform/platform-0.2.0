import { COLORS, Color, css, type t } from './common';

export type FocusedProps = { style?: t.CssValue };
export const Focused: React.FC<FocusedProps> = (props) => {
  const styles = {
    base: css({
      Absolute: -1,
      pointerEvents: 'none',
      border: `solid 1px ${Color.alpha(COLORS.BLUE, 1)}`,
    }),
  };
  return <div {...css(styles.base, props.style)}></div>;
};
