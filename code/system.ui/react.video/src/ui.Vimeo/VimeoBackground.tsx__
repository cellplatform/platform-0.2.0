import VimeoPlayer from '@vimeo/player';
import React, { useEffect, useRef, useState } from 'react';

import { css, FC, defaultValue, t } from './common';
import { usePlayerController } from './hooks/usePlayerController';
import { VimeoEvents } from './VimeoEvents';

export type VimeoBackgroundProps = {
  instance: t.VimeoInstance;
  video: number;
  opacity?: number;
  blur?: number;
  opacityTransition?: number; // msecs
};

/**
 * Component
 */
const View: React.FC<VimeoBackgroundProps> = (props) => {
  const { instance, video } = props;
  const { bus, id } = instance;
  const blur = defaultValue(props.blur, 0);
  const opacityTransition = defaultValue(props.opacityTransition, 300);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<VimeoPlayer>();

  useEffect(() => {
    const player = new VimeoPlayer(iframeRef.current as HTMLIFrameElement);
    setPlayer(player);
    return () => {
      player.destroy();
    };
  }, []); // eslint-disable-line

  usePlayerController({ instance: { id, bus }, video, player });

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
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${props.video}?background=1&dnt=true`}
        frameBorder={'0'}
        allow={'autoplay'}
        allowFullScreen={false}
        {...styles.iframe}
      />
      <div {...styles.blurMask} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  Events: t.VimeoEventsFactory;
};
export const VimeoBackground = FC.decorate<VimeoBackgroundProps, Fields>(
  View,
  { Events: VimeoEvents },
  { displayName: 'VimeoBackground' },
);
