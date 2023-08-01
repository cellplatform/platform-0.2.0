import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  playing: false,
  loop: false,
  muted: false,
  borderRadius: 0,
  width: 500,
  aspectRatio: '16:9',

  get unknown(): t.VideoSrcUnknown {
    return { kind: 'Unknown', id: '' };
  },

  get emptyStatus(): t.VideoStatus {
    return {
      percent: { complete: -1, buffered: -1 },
      secs: { total: -1, current: -1, buffered: -1 },
      is: { playing: false, complete: false, buffering: false, muted: false },
    };
  },
} as const;
