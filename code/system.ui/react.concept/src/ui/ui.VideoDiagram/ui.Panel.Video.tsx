import { Video, css, useSizeObserver, type t } from './common';

export type VideoPanelProps = {
  video?: t.VideoDiagramVideo;

  muted?: boolean;
  playing?: boolean;
  timestamp?: t.Seconds;

  style?: t.CssValue;
  onStatus?: t.VideoPlayerStatusHandler;
};

export const VideoPanel: React.FC<VideoPanelProps> = (props) => {
  const { video } = props;
  const resize = useSizeObserver();

  if (!video) return null;

  /**
   * [Render]
   */
  const height = resize.rect.height;
  const styles = {
    base: css({ position: 'relative' }),
    body: css({
      Absolute: 0,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'end',
      overflow: 'hidden',
    }),
    player: css({
      opacity: resize.resizing ? 0 : 1,
      transition: 'opacity 0.2s',
    }),
    // NB: Click mask ensure no click events ever pass through to the embedded player.
    mask: css({ Absolute: 0 }),
  };

  const elPlayer = resize.ready && (
    <div {...styles.player}>
      <Video.Player
        playing={props.playing}
        muted={props.muted}
        timestamp={props.timestamp}
        video={video.src}
        innerScale={video.innerScale}
        onStatus={props.onStatus}
        height={height}
      />
    </div>
  );

  return (
    <div ref={resize.ref} {...css(styles.base, props.style)}>
      <div {...styles.body}>{elPlayer}</div>
      <div {...styles.mask} />
    </div>
  );
};
