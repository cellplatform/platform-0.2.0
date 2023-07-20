import { COLORS, css, type t } from '../common';

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const src = 'https://slc-1dot1ggiz.vercel.app/';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.DARK,
      width: '100%',
      height: '100%',
      border: 'none',
    }),
  };

  return <iframe src={src} {...css(styles.base, props.style)} />;
};
