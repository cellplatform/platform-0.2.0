import { Color, COLORS, css, MediaStream, type t } from './common';

export type VideoProps = {
  size?: number;
  stream?: MediaStream;
  muted?: boolean;
  style?: t.CssValue;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { stream, size = 64, muted } = props;
  const gutter = 0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `solid ${stream ? 1 : 0}px ${Color.alpha(COLORS.DARK, 0.1)}`,
      height: size,
      width: stream ? size : 0,
      transition: 'width 250ms ease',
    }),
    video: css({ Absolute: [gutter, null, null, gutter] }),
  };

  const elVideo = stream && (
    <MediaStream.Video
      stream={props.stream}
      width={size - gutter * 2}
      height={size - gutter * 2}
      muted={props.muted}
      style={styles.video}
    />
  );

  return <div {...css(styles.base, props.style)}>{elVideo}</div>;
};
