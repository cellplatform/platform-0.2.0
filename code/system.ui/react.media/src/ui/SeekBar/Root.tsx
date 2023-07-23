import { COLORS, Color, DEFAULTS, FC, css, type t } from './common';

const View: React.FC<t.SeekBarProps> = (props) => {
  const progress = Wrangle.percent(props.progress);

  /**
   * Handlers
   */

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      height: 20,
      display: 'grid',
      alignContent: 'center',
    }),
    track: css({
      position: 'relative',
      height: 5,
      borderRadius: 5,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      overflow: 'hidden',
    }),
    thumb: css({
      borderRadius: 5,
      backgroundColor: COLORS.BLUE,
      Absolute: [0, null, 0, 0],
      width: `${progress * 100}%`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.track}>
        <div {...styles.thumb} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  percent(value?: number) {
    if (!value) return DEFAULTS.progress;
    return Math.max(0, Math.min(1, value));
  },
} as const;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const SeekBar = FC.decorate<t.SeekBarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'SeekBar' },
);
