import { t, slug } from './common';

export const DEFAULT = {
  ctxId() {
    return `dev:session.ctx.${slug()}`;
  },

  props(id?: string): t.SpecRenderProps {
    return {
      id: id ?? DEFAULT.ctxId(),
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
