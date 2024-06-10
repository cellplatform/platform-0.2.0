import { useExperimentalFarcasterSigner } from '@privy-io/react-auth';
import { Farcaster } from '../../fn/Farcaster';
import { type t } from './common';

export function useFarcaster(args: { privy: t.PrivyInterface; data: t.InfoData }) {
  const { privy, data } = args;
  const hubUrl = data.farcaster?.signer?.hubUrl;

  /**
   * Destructure the signer methods.
   */
  const useSigner = useExperimentalFarcasterSigner();
  const { signFarcasterMessage, requestFarcasterSignerFromWarpcast } = useSigner;
  const { getFarcasterSignerPublicKey } = useSigner;
  const signer: t.FarcasterSignerMethods = {
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
    requestFarcasterSignerFromWarpcast,
  };

  /**
   * API
   */
  return Farcaster.create({ privy, signer, hubUrl });
}
