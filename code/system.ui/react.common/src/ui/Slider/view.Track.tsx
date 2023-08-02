import { useRef } from 'react';
import { COLORS, Color, css, type t } from './common';

export type TrackProps = {
  enabled: boolean;
  percent: t.Percent;
  track: Required<t.SliderTrackProps>;
  style?: t.CssValue;
};

export const Track: React.FC<TrackProps> = (props) => {
  const { track, enabled } = props;
  const height = track.height;
  const ref = useRef<HTMLDivElement>(null);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      alignContent: 'center',
    }),
    body: css({
      position: 'relative',
      boxSizing: 'border-box',
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.06)}`,
      height,
      borderRadius: height / 2,
    }),
  };

  return (
    <div ref={ref} {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div />
      </div>
    </div>
  );
};
