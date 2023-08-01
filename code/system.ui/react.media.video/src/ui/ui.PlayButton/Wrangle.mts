import { COLORS, Color, DEFAULTS, Icons, type t } from './common';

export const Wrangle = {
  isPlaying(props: t.PlayButtonProps) {
    const { status = DEFAULTS.status, spinning = DEFAULTS.spinning } = props;
    return status === 'Pause' || spinning;
  },

  icon(status: t.PlayButtonStatus) {
    if (status === 'Play') return Icons.Play;
    if (status === 'Pause') return Icons.Pause;
    if (status === 'Replay') return Icons.Replay;
    return undefined;
  },

  buttonColors(props: t.PlayButtonProps, options: { isOver?: boolean }) {
    const isPlaying = Wrangle.isPlaying(props);
    const { enabled = DEFAULTS.enabled } = props;
    const { isOver = false } = options;
    const isActive = enabled && (isOver || isPlaying);

    let backgroundColor = Color.alpha(COLORS.DARK, 0.1);
    if (enabled && isPlaying) {
      backgroundColor = COLORS.BLUE;
    } else {
      if (enabled && isOver) backgroundColor = Color.alpha(COLORS.DARK, 0.6);
    }

    const iconColor = isActive ? COLORS.WHITE : COLORS.DARK;
    const borderColor = Color.alpha(COLORS.DARK, 0.08);
    return {
      backgroundColor,
      borderColor,
      iconColor,
    };
  },

  clickArgs(status: t.PlayButtonStatus): t.PlayButtonClickHandlerArgs {
    const play = status === 'Play';
    const pause = status === 'Pause';
    const replay = status === 'Replay';
    const playing = (play || replay) && !pause;
    const is = { playing, paused: !playing };
    return { status, play, pause, replay, is };
  },
} as const;
