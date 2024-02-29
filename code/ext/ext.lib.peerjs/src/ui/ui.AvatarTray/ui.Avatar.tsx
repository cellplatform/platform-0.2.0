import { DEFAULTS, Video, css, type t } from './common';

export type AvatarProps = {
  size?: number;
  stream?: MediaStream;
  muted?: boolean;
  borderRadius?: t.Pixels;
  style?: t.CssValue;
  onClick?: () => void;
};

export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    stream,
    size = DEFAULTS.size,
    muted = DEFAULTS.muted,
    borderRadius = DEFAULTS.borderRadius,
  } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', Size: size }),
    video: css({ Size: size }),
  };

  return (
    <div {...css(styles.base, props.style)} onMouseDown={props.onClick}>
      <Video stream={stream} muted={muted} style={styles.video} borderRadius={borderRadius} />
    </div>
  );
};
