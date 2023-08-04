import { COLORS, Color, DEFAULTS, FC, PlayButton, ProgressBar, css, type t } from './common';
import { useKeyboard } from './use.Keyboard.mjs';
import { Wrangle } from './Wrangle';

const View: React.FC<t.PlayBarProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    button = DEFAULTS.button,
    progress = DEFAULTS.progress,
    status = DEFAULTS.status,
    size = DEFAULTS.size,
    right,
    onPlayAction,
    onSeek,
    onMute,
  } = props;

  useKeyboard({
    enabled: props.useKeyboard ?? DEFAULTS.useKeyboard,
    status,
    onPlayAction,
    onSeek,
    onMute,
  });

  /**
   * [Render]
   */
  const sizes = Wrangle.sizes(props);
  const { height } = sizes;
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
        size={size}
        status={Wrangle.toPlayStatus(props)}
        spinning={status.is.buffering}
        onClick={onPlayAction}
      />
      <ProgressBar
        style={styles.bar}
        enabled={enabled}
        percent={status.percent.complete}
        buffered={status.percent.buffered}
        thumbColor={status.is.playing ? progress.thumbColor : Color.alpha(COLORS.DARK, 0.2)}
        bufferedColor={progress.bufferedColor}
        height={height}
        onClick={(e) => {
          const total = status.secs.total;
          const seconds = e.timestamp(total);
          onSeek?.({ status, seconds });
        }}
      />
      {elRight}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  sizes: typeof DEFAULTS.sizes;
  useKeyboard: typeof useKeyboard;
};
export const PlayBar = FC.decorate<t.PlayBarProps, Fields>(
  View,
  { DEFAULTS, sizes: DEFAULTS.sizes, useKeyboard },
  { displayName: 'PlayBar' },
);
