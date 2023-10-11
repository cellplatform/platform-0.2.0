import { Id, type t } from './common';

export const Is: t.WebrtcIs = {
  peerid(input) {
    return Id.is.cuid(input);
  },
} as const;
