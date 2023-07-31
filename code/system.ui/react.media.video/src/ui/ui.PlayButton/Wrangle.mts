import { COLORS, Color, Icons, DEFAULTS, type t } from './common';

export const Wrangle = {
  isPlaying(input?: t.PlayButtonStatus) {
    const status = input ?? DEFAULTS.status;
    return status === 'Pause' || status === 'Spinning';
  },

  icon(status: t.PlayButtonStatus) {
    if (status === 'Play') return Icons.Play;
    if (status === 'Pause') return Icons.Pause;
    if (status === 'Replay') return Icons.Replay;
    return undefined;
  },

  buttonColors(props: t.PlayButtonProps, options: { isOver?: boolean }) {
    const isPlaying = Wrangle.isPlaying(props.status);
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
} as const;
