export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  block: false,
  spinning: false,
  disabledOpacity: 0.3,
  userSelect: false,
  pressedOffset: [0, 1] as [number, number],
  copy: {
    message: 'copied',
    fontSize: 12,
    delay: 1200,
    opacity: 0.6,
  },
} as const;
