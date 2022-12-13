import { Color, COLORS, css, t } from '../common';
import { Image } from '../Image';
import { SAMPLE_DATA } from './DATA.mjs';

export type BrandLayoutProps = {
  style?: t.CssValue;
};

export const BrandLayout: React.FC<BrandLayoutProps> = (props) => {
  const media = SAMPLE_DATA.tempDeriveMedia();

  /**
   * [Render]
   */
  const GAP = 80;
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
        backgroundImage: `url(${SAMPLE_DATA.URLS.TRAIL_TRIBE.SHARP_DARK})`,
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
          <Image.Cover url={media.left} style={{ Absolute: 0 }} />
        </div>
        <div {...styles.outer}>
          <Image.Cover url={media.right} style={{ Absolute: 0 }} />
        </div>
      </div>
    </div>
  );
};
