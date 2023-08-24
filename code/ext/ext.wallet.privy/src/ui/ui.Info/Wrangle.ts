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
} as const;
