import { COLORS } from './common';

export const Wrangle = {
  color(args: { isEnabled: boolean; isOver: boolean }) {
    const { isEnabled, isOver } = args;
    if (!isEnabled) return COLORS.DARK;
    return isOver ? COLORS.BLUE : COLORS.DARK;
  },
  pressedOffset(args: {
    isEnabled: boolean;
    isOver: boolean;
    isDown: boolean;
    pressedOffset: [number, number];
  }) {
    const { isEnabled, isOver, isDown, pressedOffset } = args;
    if (!isEnabled) return undefined;
    if (!isOver) return undefined;
    if (!isDown) return undefined;
    return `translateX(${pressedOffset[0]}px) translateY(${pressedOffset[1]}px)`;
  },
} as const;
