export * from '../common';
export { usePeerMonitor, useTransmitMonitor } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: 'NetworkConnection',
  connectionLabel: 'WebRTC/data',
} as const;
