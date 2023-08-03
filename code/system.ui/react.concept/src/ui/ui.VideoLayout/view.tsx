import { useRef, useEffect } from 'react';

import {
  COLORS,
  Color,
  DEFAULTS,
  EdgePosition,
  Size,
  Video,
  css,
  useSizeObserver,
  type t,
} from './common';

export const View: React.FC<t.VideoLayoutProps> = (props) => {
  const {
    data,
    playing = DEFAULTS.playing,
    muted = DEFAULTS.muted,
    timestamp = DEFAULTS.timestamp,
    onSize,
  } = props;
  const src = Video.toSrc(data?.id);

  // Hooks.
  const playerDivRef = useRef<HTMLDivElement>(null);
  const resize = useSizeObserver();

  // Size.
  const parentHeight = resize.rect.height;
  const height = Size.fromPixelOrPercent(data?.height, parentHeight, data?.minHeight);
  const isMin = height <= (data?.minHeight ?? -1);

  /**
   * [Effects]
   */
  useEffect(() => {
    if (onSize && resize.ready && playerDivRef.current) {
      const container = Size.rectToSize(resize.rect);
      const video = Size.rectToSize(playerDivRef.current.getBoundingClientRect());
      onSize?.({ container, video, isMin });
    }
  }, [height]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
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
    </div>
  );

  return (
    <div ref={resize.ref} {...css(styles.base, props.style)}>
      <EdgePosition position={data?.position}>{elPlayer}</EdgePosition>
    </div>
  );
};
