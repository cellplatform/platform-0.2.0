import type * as t from './types.mjs';

export { t };
export * from './libs.mjs';

/**
 * Test Constants
 */
export const TEST = {
  signal: 'rtc.cellfs.com', // Sample WebRTC "signal server" connection coordinating end-point
} as const;
