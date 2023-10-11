import { Id, type t } from './common';

export const Is: t.WebrtcIs = {
  peerid(input) {
    return Id.is.cuid(input);
  },

  uri(input) {
    if (typeof input !== 'string') return false;
    const parts = input.split(':');
    return parts[0] === 'peer' && Is.peerid(parts[1]);
  },
} as const;
