import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Image } from '../Image';

const URL = {
  SKETCH_1:
    'https://user-images.githubusercontent.com/185555/205549096-48cd9707-bca1-4561-aa68-8df60e61f37f.jpg',
  SKETCH_2:
    'https://user-images.githubusercontent.com/185555/205729992-44c68a14-db0f-4c5b-b511-6b6774030166.jpg',
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
    body: css({
      Absolute: GAP,
      display: 'grid',
      gridTemplateColumns: `repeat(2, 1fr)`,
      columnGap: GAP,
    }),
    outer: css({
      position: 'relative',
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.8)}`,
    }),
    image: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.outer}>
          <Image.Cover url={URL.SKETCH_1} style={styles.image} />
        </div>
        <div {...styles.outer}>
          <Image.Cover url={URL.SKETCH_2} style={styles.image} />
        </div>
      </div>
    </div>
  );
};
