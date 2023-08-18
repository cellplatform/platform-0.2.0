export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  isEnabled: true,
  block: false,
  spinning: false,
  disabledOpacity: 0.3,
  userSelect: false,
  pressedOffset: [0, 1] as [number, number],
} as const;
