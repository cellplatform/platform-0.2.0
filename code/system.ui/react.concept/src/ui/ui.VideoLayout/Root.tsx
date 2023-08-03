import { useEffect, useState, useRef } from 'react';

import {
  DEFAULTS,
  EdgePosition,
  FC,
  Size,
  Video,
  css,
  Color,
  COLORS,
  useSizeObserver,
  type t,
} from './common';

const View: React.FC<t.VideoLayoutProps> = (props) => {
  const {
    data,
    playing = DEFAULTS.playing,
    muted = DEFAULTS.muted,
    timestamp = DEFAULTS.timestamp,
    onSize,
  } = props;
  const src = Video.toSrc(data?.id);

  const playerDivRef = useRef<HTMLDivElement>(null);
  const resize = useSizeObserver();
  const parentHeight = resize.rect.height;
  const height = Size.fromPixelOrPercent(data?.height, parentHeight, data?.minHeight);

  // Alert listeners to size dimensions.
  if (onSize && resize.ready && playerDivRef.current) {
    onSize?.({
      parent: resize.rect,
      video: playerDivRef.current.getBoundingClientRect(),
    });
  }

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
    player: css({ position: 'relative' }),
    debug: css({
      Absolute: 0,
      border: `solid 1px ${Color.alpha(COLORS.RED, 0.1)}`,
    }),
  };

  const elPlayer = resize.ready && height > 0 && (
    <div ref={playerDivRef} {...styles.player}>
      <Video.Player
        video={src}
        playing={playing}
        muted={muted}
        timestamp={timestamp}
        innerScale={data?.innerScale}
        onStatus={props.onStatus}
        height={height}
      />
      {props.debug && <div {...styles.debug} />}
    </div>
  );

  return (
    <div ref={resize.ref} {...css(styles.base, props.style)}>
      <EdgePosition position={data?.position}>{elPlayer}</EdgePosition>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const VideoLayout = FC.decorate<t.VideoLayoutProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'VideoLayout' },
);
