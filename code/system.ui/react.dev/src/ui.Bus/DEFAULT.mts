import { t, R } from './common';

export const DEFAULT = {
  get INFO(): t.DevInfo {
    return { run: { count: 0 } };
  },
};
