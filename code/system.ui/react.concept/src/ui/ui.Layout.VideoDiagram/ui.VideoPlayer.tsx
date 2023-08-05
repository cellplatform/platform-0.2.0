import { Video, css, useSizeObserver, type t } from './common';

export type VideoPlayerProps = {
  video?: t.VideoDiagramVideo;
  style?: t.CssValue;
  onStatus?: t.VideoPlayerStatusHandler;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const { video } = props;
  const resize = useSizeObserver();

  if (!video) return null;

  /**
   * [Render]
   */
  const height = resize.rect.height;
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

  const elPlayer = resize.ready && (
    <div {...styles.player}>
      <Video.Player
        video={video.src}
        playing={video.playing}
        muted={video.muted}
        timestamp={video.timestamp}
        innerScale={video.innerScale}
        onStatus={props.onStatus}
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
