import { COLORS, css, t } from '../common';

const URL = {
  LOGO: 'https://user-images.githubusercontent.com/185555/205543263-9bbcd71d-9607-427c-a9f5-815f7cb963e3.png',
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
      backgroundColor: COLORS.DARK,
      color: COLORS.WHITE,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      overflow: 'hidden',
    }),
    logo: css({
      width: 130,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <img src={URL.LOGO} {...styles.logo} />
    </div>
  );
};
