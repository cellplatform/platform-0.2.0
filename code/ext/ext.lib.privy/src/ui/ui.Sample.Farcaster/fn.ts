import { type t } from './common';

type A = t.FarcasterWithMetadata;
type Args = {
  privy: t.PrivyInterface;
  signer: t.FarcasterSignerMethods;
};

export const Farcaster = {
  create(args: Args): t.Farcaster {
    const { privy } = args;
    const user = privy.user;

    let _account: A | undefined;
    const findAccount = () => user?.linkedAccounts.find((a): a is A => a.type === 'farcaster');

    /**
     * API
     */
    return {
      get account() {
        _account = _account || (_account = findAccount());
        return _account;
      },
    } as const;
  },
} as const;
