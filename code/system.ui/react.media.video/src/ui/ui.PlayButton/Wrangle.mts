import { COLORS, Color, Icons, type t } from './common';

export const Wrangle = {
  isPlaying(status: t.PlayButtonStatus) {
    return status === 'Pause' || status === 'Spinning';
  },

  icon(status: t.PlayButtonStatus) {
    if (status === 'Play') return Icons.Play;
    if (status === 'Pause') return Icons.Pause;
    if (status === 'Replay') return Icons.Replay;
    return undefined;
  },

  buttonColors(args: { isOver?: boolean; isPlaying?: boolean }) {
    const { isOver = false, isPlaying = false } = args;
    const isActive = isOver || isPlaying;

    let backgroundColor = Color.alpha(COLORS.DARK, 0.1);
    if (isPlaying) {
      backgroundColor = COLORS.BLUE;
    } else {
      if (isOver) backgroundColor = Color.alpha(COLORS.DARK, 0.6);
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
