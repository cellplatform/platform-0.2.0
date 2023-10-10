/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

export { Peer } from 'peerjs';

/**
 * @system
 */
export { PatchState } from 'sys.data.json';
export { Hash, Id, Is, Path, Time, cuid, rx, slug } from 'sys.util';
