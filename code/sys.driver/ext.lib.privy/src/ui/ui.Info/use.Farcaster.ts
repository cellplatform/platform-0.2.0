import { useEffect } from 'react';
import { Farcaster, rx, useFarcasterSigner, usePrivy, useWallets, type t } from './common';

export function useFarcaster(args: { data: t.InfoData }) {
  const { data } = args;
  const cmd = data.farcaster?.cmd;
  const hubUrl = data.farcaster?.signer?.hubUrl;

  const privy = usePrivy();
  const wallets = useWallets();

  /**
   * Destructure the signer methods.
   */
  const useSigner = useFarcasterSigner();
  const { signFarcasterMessage, requestFarcasterSignerFromWarpcast } = useSigner;
  const { getFarcasterSignerPublicKey } = useSigner;
  const signer: t.FarcasterSignerMethods = {
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
    requestFarcasterSignerFromWarpcast,
  };

  /**
   * Start Cmd listener (behavior).
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (cmd && privy.ready && wallets.ready) {
      const fc = Farcaster.create({ privy, signer, hubUrl });
      Farcaster.Cmd.listen(fc, cmd, { dispose$ });
    }
    return dispose;
  }, [privy.ready, wallets.ready, hubUrl]);

  /**
   * API
   */
  const fc = Farcaster.create({ privy, signer, hubUrl });
  return {
    cmd,
    hasAccount: !!fc.account,
    hasSigner: !!fc.account?.signerPublicKey,
  } as const;
}
