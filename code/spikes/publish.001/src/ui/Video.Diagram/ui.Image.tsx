import { useEffect, useState } from 'react';
import { css, t } from '../common';

export type VideoDiagramImageReadyHandler = (e: VideoDiagramImageReadyHandlerArgs) => void;
export type VideoDiagramImageReadyHandlerArgs = { ok: boolean };

export type VideoDiagramImageProps = {
  instance: t.Instance;
  def: t.DocDiagramImageType;
  dimmed?: boolean;
  status?: t.VimeoStatus;
  style?: t.CssValue;
  onReady?: VideoDiagramImageReadyHandler;
};

export const VideoDiagramImage: React.FC<VideoDiagramImageProps> = (props) => {
  const { dimmed = false, def, status } = props;
  const isComplete = status?.percent === 1 ?? false;

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

    if (def.image) image.src = def.image;

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [def.image]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      opacity: dimmed || isComplete ? 0.2 : 1,
      transition: `opacity 300ms`,
      userSelect: 'none',
      pointerEvents: 'none',
    }),
    body: css({
      Absolute: [50, 120, 100, 120],
    }),
    image: css({
      Absolute: 0,
      backgroundSize: 'contain',
      backgroundImage: `url(${def.image})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      opacity: isReady && !failed ? 1 : 0,
      transition: `opacity 1000ms`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} className={'VideoDiagram-Image'}>
      <div {...styles.body}>
        <div {...styles.image} />
      </div>
    </div>
  );
};
