import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Image } from '../Image';

const URL = {
  SKETCH_TABLE:
    'https://user-images.githubusercontent.com/185555/205549096-48cd9707-bca1-4561-aa68-8df60e61f37f.jpg',
};

export type BrandLayoutProps = {
  style?: t.CssValue;
};

export const BrandLayout: React.FC<BrandLayoutProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ Absolute: 0 }),
    sketch: css({ Absolute: 0 }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Image.Cover url={URL.SKETCH_TABLE} style={styles.sketch} />
    </div>
  );
};
