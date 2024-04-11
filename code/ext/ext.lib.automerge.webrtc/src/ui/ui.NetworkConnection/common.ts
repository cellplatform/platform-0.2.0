export * from '../common';
export { usePeerMonitor, useTransmitMonitor } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: 'NetworkConnection',
  connectionLabel: 'net:webrtc:data',
} as const;
