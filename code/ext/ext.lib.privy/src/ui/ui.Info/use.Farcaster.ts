import { useExperimentalFarcasterSigner } from '@privy-io/react-auth';
import { Farcaster } from '../../fn/fn.Farcaster';
import { type t } from './common';

export function useFarcaster(args: { privy: t.PrivyInterface }) {
  const { privy } = args;

  /**
   * Destructure the signer methods.
   */
  const fcSigner = useExperimentalFarcasterSigner();
  const { signFarcasterMessage, requestFarcasterSignerFromWarpcast } = fcSigner;
  const { getFarcasterSignerPublicKey } = fcSigner;
  const signer: t.FarcasterSignerMethods = {
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
    requestFarcasterSignerFromWarpcast,
  };

  /**
   * API
   */
  const fc = Farcaster.create({ privy, signer });
  return { fc } as const;
}
