import { DEFAULTS, ExternalEd25519Signer, HubRestAPIClient, type t } from './common';

type A = t.FarcasterWithMetadata;
type Args = {
  privy: t.PrivyInterface;
  signer: t.FarcasterSignerMethods;
  hubUrl?: string;
};

export const Farcaster = {
  /**
   * Factory
   */
  create(args: Args): t.Farcaster {
    const { privy, hubUrl = DEFAULTS.hubUrl } = args;
    const user = privy.user;

    let _hub: t.HubRestAPIClient;
    let _signer: t.ExternalEd25519Signer;
    let _account: A | undefined;
    const findAccount = () => user?.linkedAccounts.find((a): a is A => a.type === 'farcaster');

    /**
     * API
     */
    const api: t.Farcaster = {
      get account() {
        _account = _account || (_account = findAccount());
        return _account;
      },

      get fid() {
        return api.account?.fid ?? -1;
      },

      get signer() {
        if (!_signer) {
          const signMessage = args.signer.signFarcasterMessage;
          const getPublicKey = args.signer.getFarcasterSignerPublicKey;
          _signer = new ExternalEd25519Signer(signMessage, getPublicKey);
        }
        return _signer;
      },

      get hub() {
        return _hub || (_hub = new HubRestAPIClient({ hubUrl }));
      },

      async requestSignerFromWarpcast() {
        await args.signer.requestFarcasterSignerFromWarpcast();
      },
    };
    return api;
  },
} as const;
