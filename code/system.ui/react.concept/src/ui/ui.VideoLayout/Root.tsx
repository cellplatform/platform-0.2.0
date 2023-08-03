import { DEFAULTS, EdgePosition, FC, Video, css, type t } from './common';

const View: React.FC<t.VideoLayoutProps> = (props) => {
  const {
    data,
    playing = DEFAULTS.playing,
    muted = DEFAULTS.muted,
    timestamp = DEFAULTS.timestamp,
  } = props;
  const src = Video.toSrc(data?.id);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <EdgePosition position={data?.position}>
        <Video.Player
          video={src}
          playing={playing}
          muted={muted}
          timestamp={timestamp}
          innerScale={data?.innerScale}
          onStatus={props.onStatus}
        />
      </EdgePosition>
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
