import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Path } from './common';

export type DevMediaImageProps = {
  bus: t.EventBus<any>;
  shared: t.TDevSharedPropsLens;
  style?: t.CssValue;
};

export const DevMediaImage: React.FC<DevMediaImageProps> = (props) => {
  const current = props.shared.current;
  const url = Wrangle.imageUrl(current.imageUrl);
  if (!url) return null;
  if (!Wrangle.isVisible(current)) return null;

  const fit = current.imageFit ?? 'cover';
  const isContain = fit === 'contain';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.WHITE, 0.8),
      backdropFilter: `blur(5px)`,
    }),
    img: css({
      Absolute: isContain ? 50 : 0,
      backgroundImage: `url(${url})`,
      backgroundSize: fit,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.img} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  imageUrl(input?: string) {
    if (!input) return '';
    return Path.ensureHttpsPrefix(input);
  },

  isVisible(props: t.TDevSharedProps) {
    const { imageVisible: showImage = true } = props;
    return showImage;
  },
};
