import type { t } from './common';
export * from './t.cmd';

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
  readonly ready: boolean;
  readonly account?: t.FarcasterWithMetadata;
  readonly fid: number;
  readonly signer: t.ExternalEd25519Signer;
  readonly hub: t.HubRestAPIClient;
  requestSignerFromWarpcast(): Promise<void>;
};

/**
 * Events
 */
export type FarcasterSignerHandler = (e: FarcasterSignerHandlerArgs) => void;
export type FarcasterSignerHandlerArgs = { signer: FarcasterSignerMethods };
