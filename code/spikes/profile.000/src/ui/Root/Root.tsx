import { Color, COLORS, css, t } from '../common';
import { Details } from './Details';
import { Image } from './Image';

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
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
    }),
    columns: css({
      display: 'grid',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: COLORS.WHITE,
      Padding: [80, 50],
      borderRadius: 20,
      border: `solid 1px ${Color.format(-0.06)}`,
    }),
    details: css({
      boxSizing: 'border-box',
      marginTop: 20,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.columns}>
          <Image width={360} />
          <div {...styles.details}>
            <Details />
          </div>
        </div>
      </div>
    </div>
  );
};
