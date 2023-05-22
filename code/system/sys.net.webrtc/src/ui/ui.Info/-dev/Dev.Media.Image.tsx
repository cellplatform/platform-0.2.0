import { useEffect, useState } from 'react';
import { COLORS, Color, Path, css, t } from './common';

export type DevMediaImageProps = {
  bus: t.EventBus<any>;
  shared: t.TDevSharedPropsLens;
  style?: t.CssValue;
};

export const DevMediaImage: React.FC<DevMediaImageProps> = (props) => {
  const current = props.shared.current;
  const url = Wrangle.imageUrl(current.imageUrl);
  const isVisible = Wrangle.isVisible(current);

  if (!url || !isVisible) return null;

  const fit = current.imageFit ?? 'cover';
  const isContain = fit === 'contain';

  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [url]);

  /**
   * Handlers
   */
  const onLoad = () => setLoaded(true);
  const onError = () => setError(true);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: `blur(15px)`,
      backgroundColor: Color.alpha(COLORS.WHITE, isLoaded ? 1 : 0.8),
      transition: 'background-color 0.3s ease',
    }),
    img: css({
      Absolute: isContain ? 50 : 0,
      backgroundImage: `url(${url})`,
      backgroundSize: fit,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }),
    hiddenLoader: css({
      pointerEvents: 'none',
      Absolute: [-9999, null, null, -9999],
      opacity: 0,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <img {...styles.hiddenLoader} src={url} onLoad={onLoad} onError={onError} />
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
