import { COLORS, Color } from './common';

export const Wrangle = {
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
    const borderColor = Color.alpha(COLORS.DARK, 0.1);
    return {
      backgroundColor,
      borderColor,
      iconColor,
    };
  },
} as const;
