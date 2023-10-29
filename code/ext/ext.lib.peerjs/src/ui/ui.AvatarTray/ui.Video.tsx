import { DEFAULTS, MediaStream, css, type t } from './common';

export type VideoProps = {
  size?: number;
  stream?: MediaStream;
  style?: t.CssValue;
  onClick?: () => void;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { stream, size = DEFAULTS.size } = props;

  /**
   * Event Handlers
   */
  const handleClick = () => {
    //
  };

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', Size: size }),
    video: css({ Size: size }),
  };

  return (
    <div {...css(styles.base, props.style)} onMouseDown={props.onClick}>
      <MediaStream.Video stream={stream} style={styles.video} borderRadius={4} muted={true} />
    </div>
  );
};
