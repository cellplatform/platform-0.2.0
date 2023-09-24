import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const sampleVideo: t.VideoSrcVimeo = { kind: 'Vimeo', src: '499921561' }; // Tubes.

export const DEFAULTS = {
  sampleVideo,
  enabled: true,
  playing: false,
  loop: false,
  muted: false,
  borderRadius: 0,
  width: 500,
  aspectRatio: '16:9',

  get unknown(): t.VideoSrcUnknown {
    return { kind: 'Unknown', src: '' };
  },

  get emptyStatus(): t.VideoStatus {
    return {
      percent: { complete: -1, buffered: -1 },
      secs: { total: -1, current: -1, buffered: -1 },
      is: { playing: false, complete: false, buffering: false, muted: false },
    };
  },
} as const;
