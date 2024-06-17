/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

export { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js';

/**
 * @system
 */
export { Delete, Hash, Time, Value, rx } from 'sys.util';
