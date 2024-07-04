import { Pkg } from './common';

export * from '../common';
export { usePeerMonitor, useTransmitMonitor } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:NetworkConnection`,
  connectionLabel: 'net:webrtc:data',
} as const;
