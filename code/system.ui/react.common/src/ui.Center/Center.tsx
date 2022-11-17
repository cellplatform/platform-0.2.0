import { css, t } from '../common';

export type CenterProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

/**
 * Horizontal and verical alignmnet of children.
 */
export const Center: React.FC<CenterProps> = (props) => {
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
    }),
  };
  return <div {...css(styles.base, props.style)}>{props.children}</div>;
};
