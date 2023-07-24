import { COLORS, Color } from './common';

export const Wrangle = {
  buttonColors(args: { isOver?: boolean; isPlaying?: boolean }) {
    const { isOver = false, isPlaying = false } = args;

    const isActive = isOver || isPlaying;

    const backgroundColor = isActive ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.1);
    const iconColor = isActive ? COLORS.WHITE : COLORS.DARK;
    const borderColor = Color.alpha(COLORS.DARK, 0.1);
    return {
      backgroundColor,
      borderColor,
      iconColor,
    };
  },
} as const;
