import { useEffect, useState } from 'react';
import { DEFAULTS, FC, IFrame, css, type t } from './common';

import { usePlayerController } from './hooks';
import { VimeoLib } from './libs.mjs';
import { VimeoEvents as Events } from './Events.mjs';

type Ref = React.RefObject<HTMLIFrameElement>;

/**
 * Component
 */
const View: React.FC<t.VimeoBackgroundProps> = (props) => {
  const { instance, video, opacityTransition = 300, blur = 0 } = props;
  const src = `https://player.vimeo.com/video/${props.video}?background=1&dnt=true`;

  const [ref, setRef] = useState<Ref>();
  const [player, setPlayer] = useState<VimeoLib>();

  useEffect(() => {
    const el = ref?.current;
    let player: VimeoLib | undefined;
    if (el) {
      player = new VimeoLib(el);
      setPlayer(player);
    }
    return () => {
      player?.destroy();
    };
  }, [ref]);

  usePlayerController({ instance, video, player });

  /**
   * Exist if incomplete props.
   */
  if (!instance || !video) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      Absolute: 0,
      overflow: 'hidden',
      opacity: props.opacity == undefined ? 1 : props.opacity,
      transition: opacityTransition ? `opacity ${opacityTransition}ms` : undefined,
      pointerEvents: 'none',
    }),
    iframe: css({
      userSelect: 'none',
      boxSizing: 'border-box',
      height: '56.25vw',
      left: '50%',
      minHeight: '100%',
      minWidth: '100%',
      transform: 'translate(-50%, -50%)',
      position: 'absolute',
      top: '50%',
      width: '177.77777778vh',
      overflow: 'hidden',
      border: 'none',
    }),
    blurMask: css({
      Absolute: 0,
      backdropFilter: `blur(${blur}px)`,
      opacity: 0.9,
      transition: opacityTransition
        ? `opacity ${opacityTransition}ms, backdrop-filter ${opacityTransition}ms`
        : undefined,
    }),
  };

  return (
    <div {...styles.base}>
      <IFrame
        style={styles.iframe}
        src={src}
        allow={'autoplay'}
        allowFullScreen={false}
        onReady={(e) => setRef(e.ref)}
      />
      <div {...styles.blurMask} className="blur-mask" />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  Events: typeof Events;
};
export const VimeoBackground = FC.decorate<t.VimeoBackgroundProps, Fields>(
  View,
  { Events },
  { displayName: DEFAULTS.displayName.background },
);
