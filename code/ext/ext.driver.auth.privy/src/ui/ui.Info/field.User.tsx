import { type t } from './common';

export function FieldUser(
  privy: t.PrivyInterface,
  fields: t.InfoField[],
  data: t.InfoData,
): t.PropListItem[] {
  const enabled = privy.ready;
  const user = privy.user;
  if (!enabled || !user) return [];

  return [
    {
      label: 'Identifier',
      value: user.id,
    },
  ];
}
