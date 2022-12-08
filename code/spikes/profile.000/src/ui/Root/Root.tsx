import { Color, COLORS, css, t } from '../common';
import { Details } from './Details';

const URL = {
  FACE_1:
    'https://user-images.githubusercontent.com/185555/206095850-8b561843-50f3-4549-a5e3-dcfc6bae474d.png',
  FACE_2:
    'https://user-images.githubusercontent.com/185555/206325854-f418b496-cb14-4ff2-8f66-1c91d40ecb7a.png',
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
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    }),
    body: css({
      Absolute: 0,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
    }),
    columns: css({
      display: 'grid',
      // gridTemplateColumns: `repeat(2, 1fr)`,
      // columnGap: 20,
    }),
    logo: css({
      width: 360,
      borderRadius: 20,
    }),
    details: css({
      marginTop: 20,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.columns}>
          <img src={URL.FACE_1} {...styles.logo} />
          <Details style={styles.details} />
        </div>
      </div>
    </div>
  );
};
