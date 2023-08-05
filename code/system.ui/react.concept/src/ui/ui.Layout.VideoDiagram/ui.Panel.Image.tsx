import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Image } from './common';

import { SAMPLE } from '../../test.ui';

export type ImagePanelProps = {
  image?: t.VideoDiagramImage;
  style?: t.CssValue;
};

export const ImagePanel: React.FC<ImagePanelProps> = (props) => {
  const { image = {} } = props;
  const defaults = DEFAULTS.image;

  if (!image.src) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      paddingBottom: 1,
    }),
  };

  /**
   * TODO 🐷
   * - pass image props down
   * - fire image events up
   */

  return (
    <div {...css(styles.base, props.style)}>
      <Image src={image.src} sizing={image.sizing ?? defaults.sizing} />
    </div>
  );
};
