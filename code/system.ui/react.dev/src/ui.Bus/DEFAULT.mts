import { t } from './common';

export const DEFAULT = {
  get INFO(): t.DevInfo {
    return {
      instance: { context: '' },
      render: {},
      run: { count: 0 },
    };
  },
};
