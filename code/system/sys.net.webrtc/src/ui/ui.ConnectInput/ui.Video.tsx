import { MediaStream, Color, COLORS, css, t, rx } from './common';

export type VideoProps = {
  size?: number;
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { stream, size = 64 } = props;
  const gutter = 0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Size: size,
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    video: css({ Absolute: [gutter, null, null, gutter] }),
    frame: css({
      Absolute: 8,
      pointerEvents: 'none',
      border: `dashed 1px ${Color.alpha(COLORS.WHITE, 0.4)}`,
      borderRadius: 8,
    }),
  };

  const elVideo = stream && (
    <MediaStream.Video
      stream={props.stream}
      width={size - gutter * 2}
      height={size - gutter * 2}
      muted={true}
      style={styles.video}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elVideo}
      <div {...styles.frame} />
    </div>
  );
};
