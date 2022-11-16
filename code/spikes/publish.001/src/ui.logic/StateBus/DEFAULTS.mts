import { t } from '../common';

export const DEFAULTS = {
  instance: 'singleton',

  get state(): t.StateTree {
    return {
      env: { media: { muted: false } },
      selection: { index: { path: '' } },
    };
  },
};
