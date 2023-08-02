import { Wrangle } from './Wrangle.mjs';
import { css, type t } from './common';

export type TrackProps = {
  enabled: boolean;
  percent: t.Percent;
  totalWidth: t.Pixels;
  track: t.SliderTrackProps;
  thumb: t.SliderThumbProps;
  style?: t.CssValue;
};

export const Track: React.FC<TrackProps> = (props) => {
  const { totalWidth, thumb, track, percent, enabled } = props;
  const height = track.height;
  const thumbLeft = Wrangle.thumbLeft(percent, totalWidth, thumb.size);

  /**
   * [Render]
   */
  const borderRadius = height / 2;
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      alignContent: 'center',
    }),
    body: css({
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: track.defaultColor,
      borderRadius,
      height,
    }),
    progress: css({
      backgroundColor: track.progressColor,
      borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
      height,
      Absolute: [0, null, 0, 0],
      width: thumbLeft + thumb.size / 2,
      opacity: percent == 0 ? 0 : enabled ? 1 : 0.3,
      transition: 'opacity 0.2s',
    }),
    border: css({
      Absolute: 0,
      border: `solid 1px ${track.borderColor}`,
      borderRadius,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.progress} />
        <div {...styles.border} />
      </div>
    </div>
  );
};
