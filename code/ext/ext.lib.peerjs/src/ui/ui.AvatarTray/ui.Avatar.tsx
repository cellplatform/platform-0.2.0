import { COLORS, DEFAULTS, Video, css, type t } from './common';

export type AvatarProps = {
  size?: number;
  stream?: MediaStream;
  isSelected?: boolean;
  muted?: boolean;
  borderRadius?: t.Pixels;
  theme?: t.CommonTheme;
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
    selected: css({
      borderRadius,
      Absolute: 0,
      border: `solid 3px ${COLORS.BLUE}`,
      pointerEvents: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onMouseDown={props.onClick}>
      <Video stream={stream} muted={muted} style={styles.video} borderRadius={borderRadius} />
      {props.isSelected && <div {...styles.selected} />}
    </div>
  );
};
