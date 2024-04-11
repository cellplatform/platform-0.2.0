import { type t } from './common';
import { PeerId } from './Peer.Id';

export const PeerIs: t.PeerIs = {
  peerid(input) {
    if (typeof input !== 'string') return false;
    return PeerId.is(input.trim());
  },

  uri(input) {
    if (typeof input !== 'string') return false;
    const parts = input.trim().split(':');
    return parts[0] === 'peer' && PeerIs.peerid(parts[1]);
  },

  Kind: {
    data(input: any): input is t.PeerConnectionKindData {
      return wrangle.kind(input) === 'data';
    },

    media(input: any): input is t.PeerConnectionKindMedia {
      return PeerIs.Kind.video(input) || PeerIs.Kind.screen(input);
    },

    video(input: any): input is t.PeerConnectionKindMediaVideo {
      return wrangle.kind(input) === 'media:video';
    },

    screen(input: any): input is t.PeerConnectionKindMediaScreen {
      return wrangle.kind(input) === 'media:screen';
    },
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  kind(input: any): string {
    if (!input) return '';
    if (typeof input === 'string') return input;
    if (typeof input === 'object' && typeof input.kind === 'string') return input.kind;
    return '';
  },
} as const;
