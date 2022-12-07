import { COLORS, css, t } from '../common';

const URL = {
  FACE: 'https://user-images.githubusercontent.com/185555/206095850-8b561843-50f3-4549-a5e3-dcfc6bae474d.png',
};

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.WHITE,
      color: COLORS.DARK,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      overflow: 'hidden',
    }),
    logo: css({
      width: 360,
      borderRadius: 20,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <img src={URL.FACE} {...styles.logo} />
    </div>
  );
};
