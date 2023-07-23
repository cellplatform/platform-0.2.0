import { COLORS, Color, Icons, css, useMouseState, type t } from './common';

export type PlayButtonProps = {
  playing?: boolean;
  style?: t.CssValue;
  onClick?: (e: {}) => void;
};

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const Icon = Wrangle.Icon(props);
  const mouse = useMouseState({ onDown: (e) => props.onClick?.({}) });
  const { isOver, isDown } = mouse;

  /**
   * [Render]
   */
  const { backgroundColor, borderColor, iconColor } = Wrangle.colors(isOver, isDown);
  const styles = {
    base: css({
      backgroundColor,
      border: `solid 1px ${borderColor}`,
      width: 56,
      borderRadius: 4,
      display: 'grid',
      placeItems: 'center',
      PaddingY: 3,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <Icon size={22} color={iconColor} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  Icon(props: PlayButtonProps) {
    return props.playing ? Icons.Pause.Sharp : Icons.Play.Sharp;
  },

  colors(isOver: boolean, isDown: boolean) {
    const backgroundColor = isOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.1);
    const iconColor = isOver ? COLORS.WHITE : COLORS.DARK;
    const borderColor = Color.alpha(COLORS.DARK, 0.1);
    return { backgroundColor, borderColor, iconColor };
  },
} as const;
