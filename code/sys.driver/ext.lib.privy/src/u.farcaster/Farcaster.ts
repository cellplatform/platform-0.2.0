import { DEFAULTS, ExternalEd25519Signer, HubRestAPIClient, type t } from './common';
import { FarcasterCommand as Cmd } from './Farcaster.Command';

type A = t.FarcasterWithMetadata;
type Args = {
  privy: t.PrivyInterface;
  signer: t.FarcasterSignerMethods;
  hubUrl?: string;
};

export const Farcaster = {
  Cmd,

  /**
   * Factory
   */
  create(args: Args): t.Farcaster {
    const { privy } = args;
    const user = privy.user;

    let _hub: t.HubRestAPIClient;
    let _signer: t.ExternalEd25519Signer;
    let _account: A | undefined;
    const findAccount = () => user?.linkedAccounts.find((a): a is A => a.type === 'farcaster');

    /**
     * API
     */
    const fc: t.Farcaster = {
      get ready() {
        return privy.ready;
      },

      get account() {
        _account = _account || (_account = findAccount());
        return _account;
      },

      get fid() {
        return fc.account?.fid ?? -1;
      },

      get signer() {
        return _signer || (_signer = create.signer(args));
      },

      get hub() {
        return _hub || (_hub = create.hub(args));
      },

      async requestSignerFromWarpcast() {
        await args.signer.requestFarcasterSignerFromWarpcast();
      },
    };
    return fc;
  },
} as const;

/**
 * Helpers
 */
const create = {
  signer(args: Args) {
    const { signFarcasterMessage, getFarcasterSignerPublicKey } = args.signer;
    return new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);
  },

  hub(args: Args) {
    const { hubUrl = DEFAULTS.hubUrl } = args;
    return new HubRestAPIClient({ hubUrl });
  },
} as const;
