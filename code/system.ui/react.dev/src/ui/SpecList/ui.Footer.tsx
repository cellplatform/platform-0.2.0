import { css, t } from '../common';

export type FooterProps = {
  style?: t.CssValue;
};

/**
 * NOTE:
 *    Acts as a spacer for the bottom of the list for scrolling.
 */
export const Footer: React.FC<FooterProps> = (props) => {
  const styles = { base: css({ height: 80 }) };
  return <div {...css(styles.base, props.style)}></div>;
};
