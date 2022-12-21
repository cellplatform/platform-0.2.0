import { t, slug } from './common';

export const DEFAULT = {
  ctxId() {
    return `dev:session.ctx.${slug()}`;
  },

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
