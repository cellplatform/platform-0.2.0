import { useEffect, useState } from 'react';

import { css, t } from '../common';

type UrlString = string;

export type VideoDiagramImageReadyHandler = (e: VideoDiagramImageReadyHandlerArgs) => void;
export type VideoDiagramImageReadyHandlerArgs = { ok: boolean };

export type VideoDiagramImageProps = {
  src?: UrlString;
  dimmed?: boolean;
  style?: t.CssValue;
  onReady?: VideoDiagramImageReadyHandler;
};

export const VideoDiagramImage: React.FC<VideoDiagramImageProps> = (props) => {
  const { dimmed = false, src } = props;

  const [isReady, setIsReady] = useState(false);
  const [failed, setFailed] = useState(false);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    /**
     * Monitor image load.
     */
    const image = new Image();

    /**
     * TODO 🐷
     * - Communicate load state with parent so that images/video/etc
     *   all load with a single "snap" (fade-in).
     */

    const handleLoad = () => handleReady(true);
    const handleError = () => handleReady(false);
    const handleReady = (ok: boolean) => {
      setIsReady(true);
      setFailed(!ok);
      props.onReady?.({ ok });
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    if (src) image.src = src;

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [src]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      opacity: dimmed ? 0.4 : 1,
      transition: `opacity 300ms`,
      userSelect: 'none',
      pointerEvents: 'none',
    }),
    image: css({
      Absolute: 0,
      backgroundSize: 'contain',
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      opacity: isReady && !failed ? 1 : 0,
      transition: `opacity 1000ms`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.image} />
    </div>
  );
};
