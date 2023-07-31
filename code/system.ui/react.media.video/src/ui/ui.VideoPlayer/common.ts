import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  playing: false,
  loop: false,

  get unknown(): t.VideoDefUnknown {
    return { kind: 'Unknown', id: '' };
  },

  get emptyStatus(): t.VideoStatus {
    return {
      percent: -1,
      secs: { total: -1, current: -1, buffered: -1 },
      is: { playing: false, complete: false, buffering: false },
    };
  },
} as const;
