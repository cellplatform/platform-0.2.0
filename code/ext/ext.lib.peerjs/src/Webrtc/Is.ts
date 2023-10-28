import { type t } from './common';
import { PeerId } from './Peer.Id';

export const Is: t.WebrtcIs = {
  peerid(input) {
    if (typeof input !== 'string') return false;
    return PeerId.is(input.trim());
  },

  uri(input) {
    if (typeof input !== 'string') return false;
    const parts = input.trim().split(':');
    return parts[0] === 'peer' && Is.peerid(parts[1]);
  },

  kind: {
    data(input: any): input is t.PeerConnectionDataKind {
      return input === 'data';
    },

    media(input: any): input is t.PeerConnectionMediaKind {
      return input === 'media:video' || input === 'media:screen';
    },
  },
} as const;
