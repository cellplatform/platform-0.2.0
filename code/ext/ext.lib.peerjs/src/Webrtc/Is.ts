import { Id, type t } from './common';

export const Is: t.WebrtcIs = {
  peerid(input) {
    if (typeof input !== 'string') return false;
    return Id.is.cuid(input.trim());
  },

  uri(input) {
    if (typeof input !== 'string') return false;
    const parts = input.trim().split(':');
    return parts[0] === 'peer' && Is.peerid(parts[1]);
  },
} as const;
