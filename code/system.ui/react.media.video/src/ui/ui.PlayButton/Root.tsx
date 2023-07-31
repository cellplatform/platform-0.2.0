import { css, DEFAULTS, FC, Spinner, useMouseState, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

const View: React.FC<t.PlayButtonProps> = (props) => {
  const { status = DEFAULTS.status } = props;
  const isSpinning = status === 'Spinning';
  const isPlaying = Wrangle.isPlaying(status);
  const Icon = Wrangle.icon(status);

  const mouse = useMouseState({ onDown: (e) => props.onClick?.({ status }) });
  const { isOver } = mouse;

  /**
   * [Render]
   */
  const { backgroundColor, borderColor, iconColor } = Wrangle.buttonColors({ isOver, isPlaying });
  const styles = {
    base: css({
      backgroundColor,
      transition: 'background-color 0.15s',
      border: `solid 1px ${borderColor}`,
      borderRadius: 4,
      boxSizing: 'border-box',
      width: DEFAULTS.width,
      height: DEFAULTS.height,
      PaddingY: 3,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elIcon = Icon && !isSpinning && <Icon size={22} color={iconColor} />;
  const elSpinner = isSpinning && <Spinner.Bar color={iconColor} width={20} />;

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      {elIcon}
      {elSpinner}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
};
export const PlayButton = FC.decorate<t.PlayButtonProps, Fields>(
  View,
  { DEFAULTS, Wrangle },
  { displayName: 'PlayButton' },
);
