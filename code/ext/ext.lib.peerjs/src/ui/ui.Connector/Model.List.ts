import { Model, type t } from './common';
import { Remote, type RemoteOptions } from './Model.Remote';
import { Self, type SelfOptions } from './Model.Self';
import { Renderers } from './Renderers';

export const List = {
  /**
   * Initialize a new [List] controller model.
   */
  init(options: { self?: SelfOptions; remote?: RemoteOptions } = {}) {
    const ctx: t.GetConnectorCtx = () => ({ list });
    const self = Self.state({ ...options.self, ctx });
    const first = Remote.state({ ...options.remote, ctx });

    const getItem: t.GetLabelItem = (target) => {
      if (typeof target === 'number') {
        const index = target;
        if (index === 0) return [self, index];
        if (index === 1) return [first, index];
      } else {
        /**
         * TODO 🐷
         */
        if (self.instance === target) return [self, 0];
        if (first.instance === target) return [first, 0];
      }

      return [undefined, -1];
    };

    const renderers = Renderers.init({ ctx });
    const getRenderers: t.GetLabelItemRenderers = (args) => renderers;

    const list = Model.List.state({ total: 2, getItem, getRenderers });
    return { list, ctx } as const;
  },
} as const;
