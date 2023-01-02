import { t } from './common';

export const DEFAULT = {
  props(): t.DevRenderProps {
    return {
      host: {},
      component: {},
      debug: { main: { renderers: [] } },
    };
  },

  info(): t.DevInfo {
    return {
      instance: { kind: 'dev:harness', context: '', bus: '' },
      render: {},
      run: { count: 0 },
    };
  },
};
