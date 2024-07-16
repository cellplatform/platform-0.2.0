import { Pkg, type t } from './common';
export { Peer, Webrtc } from '../../Webrtc';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Dev.PeerCard`,
} as const;
