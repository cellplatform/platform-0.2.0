import type { t } from './common';

/**
 * Privy
 */
export type GetFarcasterSignerPublicKey = () => Promise<Uint8Array>;
export type SignFarcasterMessage = (messageHash: Uint8Array) => Promise<Uint8Array>;
export type RequestFarcasterSignerFromWarpcast = () => Promise<void>;

export type FarcasterSignerMethods = {
  getFarcasterSignerPublicKey: GetFarcasterSignerPublicKey;
  signFarcasterMessage: SignFarcasterMessage;
  requestFarcasterSignerFromWarpcast: RequestFarcasterSignerFromWarpcast;
};

/**
 * Farcaster helper object.
 */
export type Farcaster = {
  readonly account?: t.FarcasterWithMetadata;
};

/**
 * Events
 */
export type FarcasterSignerHandler = (e: FarcasterSignerHandlerArgs) => void;
export type FarcasterSignerHandlerArgs = { signer: FarcasterSignerMethods };
