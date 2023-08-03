import { DEFAULTS, EdgePosition, FC, Size, Video, css, useSizeObserver, type t } from './common';

const View: React.FC<t.VideoLayoutProps> = (props) => {
  const {
    data,
    playing = DEFAULTS.playing,
    muted = DEFAULTS.muted,
    timestamp = DEFAULTS.timestamp,
  } = props;
  const src = Video.toSrc(data?.id);

  const resize = useSizeObserver();
  const parentHeight = resize.rect.height;
  const height = Size.fromPixelOrPercent(data?.height, parentHeight, data?.minHeight);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  const elPlayer = resize.ready && height > 0 && (
    <Video.Player
      video={src}
      playing={playing}
      muted={muted}
      timestamp={timestamp}
      innerScale={data?.innerScale}
      onStatus={props.onStatus}
      height={height}
    />
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
