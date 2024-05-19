import { Wrangle } from './Wrangle';
import { DEFAULTS, PlayButton, css, type t } from './common';
import { Progress } from './ui.Progress';
import { useKeyboard } from './use.Keyboard.mjs';

export const View: React.FC<t.PlayBarProps> = (props) => {
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
    enabled: enabled && (props.useKeyboard ?? DEFAULTS.useKeyboard),
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
      columnGap: size === 'Large' ? 15 : 10,
    }),
    right: css({ display: 'grid' }),
  };

  const elRight = right && <div {...styles.right}>{right}</div>;

  const elButton = (
    <PlayButton
      {...button}
      enabled={enabled}
      size={size}
      status={Wrangle.toPlayStatus(props)}
      spinning={status.is.buffering}
      onClick={onPlayAction}
    />
  );

  const elProgress = (
    <Progress
      //
      enabled={enabled}
      status={status}
      size={size}
      progress={progress}
      onSeek={onSeek}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elButton}
      {elProgress}
      {elRight}
    </div>
  );
};
