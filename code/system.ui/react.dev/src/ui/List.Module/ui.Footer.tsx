import { Color, css, type t } from '../common';

export type FooterProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * NOTE:
 *    Acts as a spacer for the bottom of the list for scrolling.
 */
export const Footer: React.FC<FooterProps> = (props) => {
  const color = Color.fromTheme(props.theme);
  const styles = {
    base: css({ height: 80, color }),
  };
  return <div {...css(styles.base, props.style)}></div>;
};
