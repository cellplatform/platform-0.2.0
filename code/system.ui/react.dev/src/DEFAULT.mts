import * as t from './common/types.mjs';

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
      instance: { kind: 'dev:harness', session: '', bus: '' },
      render: { revision: { props: 0, state: 0 } },
      run: { count: 0 },
    };
  },

  /**
   * URL query-string keys.
   */
  QS: {
    D: 'd', // NB: alias for "?dev"
    DEV: 'dev',
  },
};
