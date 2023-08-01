import { COLORS, Color, DEFAULTS, FC, PlayButton, ProgressBar, css, type t } from './common';

const View: React.FC<t.PlayBarProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    button = DEFAULTS.button,
    progress = DEFAULTS.progress,
    status = DEFAULTS.status,
    replay = DEFAULTS.replay,
    right,
  } = props;

  /**
   * [Render]
   */
  const height = DEFAULTS.height;
  const styles = {
    base: css({
      height,
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: Boolean(right) ? 'auto 1fr auto' : 'auto 1fr',
      alignContent: 'center',
      columnGap: 10,
    }),
    button: css({}),
    bar: css({}),
    right: css({ display: 'grid' }),
  };

  const elRight = right && <div {...styles.right}>{right}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <PlayButton
        {...button}
        style={styles.button}
        enabled={enabled}
        status={Wrangle.toPlayStatus(props)}
        spinning={status.is.buffering}
        onClick={props.onPlayClick}
      />
      <ProgressBar
        style={styles.bar}
        enabled={enabled}
        percent={status.percent.complete}
        buffered={status.percent.buffered}
        thumbColor={status.is.playing ? progress.thumbColor : Color.alpha(COLORS.DARK, 0.2)}
        bufferedColor={progress.bufferedColor}
        height={height}
        onClick={props.onProgressClick}
      />
      {elRight}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  toPlayStatus(props: t.PlayBarProps): t.PlayButtonStatus {
    const { status = DEFAULTS.status, replay = DEFAULTS.replay } = props;
    if (replay && status.is.complete) return 'Replay';
    return status.is.playing ? 'Pause' : 'Play';
  },
} as const;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PlayBar = FC.decorate<t.PlayBarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PlayBar' },
);
