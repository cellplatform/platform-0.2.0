import { COLORS, Color, MediaStream, css, type t } from '../common';

export type VideoProps = {
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Video: React.FC<VideoProps> = (props) => {
  /**
   * [Render]
   */
  const Size = 16;
  const borderRadius = 3;
  const styles = {
    base: css({
      Size,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      borderRadius,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {props.stream && (
        <MediaStream.Video
          stream={props.stream}
          width={Size}
          height={Size}
          muted={true}
          borderRadius={borderRadius}
        />
      )}
    </div>
  );
};
