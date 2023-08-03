import { DEFAULTS, EdgePosition, FC, Video, css, type t } from './common';

const View: React.FC<t.VideoLayoutProps> = (props) => {
  const { video } = props;
  const src = Video.toSrc(video?.id);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <EdgePosition position={video?.position}>
        <Video.Player video={src} innerScale={video?.innerScale} />
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
