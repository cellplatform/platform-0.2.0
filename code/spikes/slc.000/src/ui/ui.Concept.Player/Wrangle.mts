import { COLORS, Color } from './common';

export const Wrangle = {
  buttonColors(isOver: boolean) {
    const backgroundColor = isOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.1);
    const iconColor = isOver ? COLORS.WHITE : COLORS.DARK;
    const borderColor = Color.alpha(COLORS.DARK, 0.1);
    return { backgroundColor, borderColor, iconColor };
  },
} as const;
