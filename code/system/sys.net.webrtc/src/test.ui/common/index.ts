export type { t } from '../common.t';
export * from './libs.mjs';

/**
 * Test Constants
 */
export const TEST = {
  /**
   * WebRTC "signal server" connection coordinating end-point.
   */
  signal: 'rtc.cellfs.com',
} as const;
