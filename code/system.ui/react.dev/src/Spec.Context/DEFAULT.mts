import { t, slug } from '../common';

export const DEFAULT = {
  slugId() {
    return `dev:session.ctx.${slug()}`;
  },

  props(id?: string): t.SpecRenderProps {
    return {
      id: id ?? DEFAULT.slugId(),
      host: {},
      component: {},
      debug: { main: { renderers: [] } },
    };
  },
};
