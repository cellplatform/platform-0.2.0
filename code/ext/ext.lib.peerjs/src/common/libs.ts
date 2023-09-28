/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

export { Peer } from 'peerjs';

/**
 * @system
 */
export { Id, Is, Path, Time, cuid, rx } from 'sys.util';
