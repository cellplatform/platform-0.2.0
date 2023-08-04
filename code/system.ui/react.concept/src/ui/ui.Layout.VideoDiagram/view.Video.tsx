import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Video, useSizeObserver } from './common';

export type VideoViewProps = {
  style?: t.CssValue;
};

export const VideoView: React.FC<VideoViewProps> = (props) => {
  const resize = useSizeObserver();
  const height = resize.rect.height;

  /**
   * TODO 🐷
   */
  console.log('resize', resize.batch, resize.resizing);

  useEffect(() => {
    console.log('height', height);
  }, [height]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      overflow: 'hidden',
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'end',
    }),
    player: css({
      opacity: resize.resizing ? 0 : 1,
      transition: 'opacity 0.2s',
    }),
  };

  const src = Video.toSrc(612010014);

  const elPlayer = resize.ready && (
    <div {...styles.player}>
      <Video.Player
        video={src}
        // playing={playing}
        // muted={muted}
        // timestamp={timestamp}
        innerScale={1.1}
        // onStatus={props.onStatus}
        height={height}
      />
    </div>
  );

  return (
    <div ref={resize.ref} {...css(styles.base, props.style)}>
      {elPlayer}
    </div>
  );
};
