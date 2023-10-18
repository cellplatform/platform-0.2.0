import { Model, PatchState, type t } from './common';
import { Remote, type RemoteOptions } from './Model.Remote';
import { Self, type SelfOptions } from './Model.Self';

export const List = {
  init(options: { self?: SelfOptions; remote?: RemoteOptions } = {}) {
    const ctx: t.GetConnectorCtx = () => ({ list });
    const self = Self.init({ ...options.self, ctx });
    const first = Remote.init({ ...options.remote, ctx });

    const getItem: t.GetLabelItem = (target) => {
      if (typeof target === 'number') {
        const index = target;
        if (index === 0) return [self.state, index];
        if (index === 1) return [first.state, index];
      } else {
      }

      return [undefined, -1];
    };

    const initial: t.ConnectorList = {
      state: Model.List.state({ total: 2, getItem }),
      // items: [self, first],
    };
    const list = PatchState.init<t.ConnectorList>({ initial });
    return list;
  },
} as const;
