import { PropList, type t } from './common';

export const Wrangle = {
  title(props: t.InfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },

  toLoginMethods(fields: t.InfoField[] = []) {
    return fields
      .filter((field) => field.startsWith('Login.Method.'))
      .map((field) => {
        if (field === 'Login.Method.SMS') return 'sms';
        if (field === 'Login.Method.Wallet') return 'wallet';
        return;
      })
      .filter(Boolean) as t.AuthLoginMethod[];
  },

  toStatus(privy: t.PrivyInterface): t.AuthStatus {
    const { authenticated, ready } = privy;
    const user = privy.user || undefined;
    delete user?.apple;
    delete user?.discord;
    delete user?.email;
    delete user?.github;
    delete user?.google;
    delete user?.twitter;
    return { authenticated, ready, user };
  },

  toDepFlag(privy: t.PrivyInterface) {
    const { authenticated, ready, user } = privy;

    const did = user?.id;
    const wallet = user?.wallet?.address;
    const linked = (user?.linkedAccounts ?? [])
      .map((acc) => {
        if (acc.type === 'wallet') return acc.address;
        if (acc.type === 'phone') return acc.number;
        return '';
      })
      .filter(Boolean);

    return `${authenticated}:${ready}:${did}:${linked}:${wallet}`;
  },
} as const;
