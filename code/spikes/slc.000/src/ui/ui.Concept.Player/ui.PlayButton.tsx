import { css, Icons, useMouseState, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

export type PlayButtonProps = {
  isPlaying?: boolean;
  style?: t.CssValue;
  onClick?: () => void;
};

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const { isPlaying } = props;
  const Icon = props.isPlaying ? Icons.Pause.Sharp : Icons.Play.Sharp;
  const mouse = useMouseState({ onDown: (e) => props.onClick?.() });
  const { isOver, isDown } = mouse;

  /**
   * [Render]
   */
  const { backgroundColor, borderColor, iconColor } = Wrangle.buttonColors({ isOver, isPlaying });
  const styles = {
    base: css({
      backgroundColor,
      transition: 'background-color 0.15s',
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
