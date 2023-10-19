import { Model, type t } from './common';
import { Remote, type RemoteOptions } from './Model.Remote';
import { Self, type SelfOptions } from './Model.Self';

export const List = {
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
      }

      return [undefined, -1];
    };

    const list = Model.List.state({ total: 2, getItem });
    return { list, ctx } as const;
  },
} as const;
