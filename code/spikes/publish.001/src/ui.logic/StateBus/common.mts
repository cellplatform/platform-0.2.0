import { t } from '../common';
export * from '../common';

export const DEFAULTS = {
  instance: 'singleton',

  get state(): t.StateTree {
    return { selection: { index: { url: '' } } };
  },
};
