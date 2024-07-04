import { COLORS, Color, Pkg } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:ProgressBar`,
  enabled: true,
  percent: 0,
  buffered: 0,
  thumbColor: COLORS.BLUE,
  bufferedColor: Color.alpha(COLORS.DARK, 0.12),
  trackColor: Color.alpha(COLORS.DARK, 0.06),
  height: 30,
} as const;
