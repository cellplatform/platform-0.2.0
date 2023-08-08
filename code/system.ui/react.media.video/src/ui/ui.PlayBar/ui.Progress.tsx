import { COLORS, Color, Slider, css, type t } from './common';

export type ProgressProps = {
  enabled: boolean;
  size: t.PlayButtonSize;
  status: t.VideoStatus;
  progress?: t.PlayBarPropsProgress;
  style?: t.CssValue;
  onSeek?: t.PlayBarSeekHandler;
};

export const Progress: React.FC<ProgressProps> = (props) => {
  const { enabled, status, progress, size } = props;

  /**
   * [Render]
   */
  let height = 5;
  if (size === 'Large') height = 10;

  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'center',
    }),
  };

  const bufferedTrack = Slider.DEFAULTS.track((track) => {
    track.height = height;
    track.percent = status.percent.buffered;
    track.color.border = 0;
    track.color.default = 0;
    track.color.highlight = progress?.bufferedColor ?? Color.alpha(COLORS.DARK, 0.15);
  });

  const progessTrack = Slider.DEFAULTS.track((track) => {
    const playingColor = progress?.thumbColor ?? COLORS.BLUE;
    track.color.highlight = status.is.playing ? playingColor : Color.alpha(COLORS.DARK, 0.2);
    track.height = height;
    track.percent = status.percent.complete;
  });

  return (
    <div {...css(styles.base, props.style)}>
      <Slider
        enabled={enabled}
        percent={status.percent.complete}
        thumb={{ size: height, opacity: 0 }}
        track={[bufferedTrack, progessTrack]}
        ticks={progress?.ticks}
        onChange={(e) => {
          const total = status.secs.total;
          const seconds = total * e.percent;
          props.onSeek?.({ status, seconds });
        }}
      />
    </div>
  );
};
