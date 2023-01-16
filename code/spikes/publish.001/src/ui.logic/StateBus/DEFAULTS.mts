import { type t } from '../common';

export const DEFAULTS = {
  instance: 'singleton',

  get state(): t.StateTree {
    return {
      env: { media: { muted: false } },
      loading: { document: undefined },
      selection: { index: { path: '' } },
    };
  },
} as const;
