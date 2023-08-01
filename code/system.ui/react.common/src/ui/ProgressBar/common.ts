export * from '../common';
import { Color, COLORS } from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  percent: 0,
  buffered: 0,
  thumbColor: COLORS.BLUE,
  bufferedColor: Color.alpha(COLORS.DARK, 0.12),
  trackColor: Color.alpha(COLORS.DARK, 0.06),
  height: 30,
} as const;
