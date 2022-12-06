import { Color, COLORS, css, t } from '../common';
import { Image } from '../Image';

const URL = {
  SKETCH_1:
    'https://user-images.githubusercontent.com/185555/205549096-48cd9707-bca1-4561-aa68-8df60e61f37f.jpg',
  SKETCH_2:
    'https://user-images.githubusercontent.com/185555/205729992-44c68a14-db0f-4c5b-b511-6b6774030166.jpg',
  SHARP_DARK:
    'https://user-images.githubusercontent.com/185555/205815437-fddd3691-1a5b-4113-8bdc-68944e4e153e.png',
};

export type BrandLayoutProps = {
  style?: t.CssValue;
};

export const BrandLayout: React.FC<BrandLayoutProps> = (props) => {
  const GAP = 60;
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.WHITE,
    }),
    columns: css({
      Absolute: GAP,
      display: 'grid',
      gridTemplateColumns: `repeat(2, 1fr)`,
      columnGap: GAP,
    }),
    outer: css({
      position: 'relative',
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.8)}`,
    }),
    sharp: {
      outer: css({
        position: 'relative',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }),
      image: css({
        Absolute: '30%',
        backgroundImage: `url(${URL.SHARP_DARK})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
      }),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.columns}>
        <div {...styles.outer}>
          <Image.Cover url={URL.SKETCH_1} style={{ Absolute: 0 }} />
        </div>
        <div {...styles.outer}>
          <Image.Cover url={URL.SKETCH_2} style={{ Absolute: 0 }} />
        </div>
      </div>
    </div>
  );
};
