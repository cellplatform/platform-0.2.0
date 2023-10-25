import { Renderers } from '../ui.Connector/Renderers';
import { Remote } from './Model.Remote';
import { Self } from './Model.Self';
import { Model, type t } from './common';

export const List = {
  /**
   * Initialize a new [List] controller model.
   */
  init(options: { peer: t.PeerModel }) {
    const { peer } = options;
    const { dispose$ } = peer;

    const { getItem } = Model.List.array((index) => {
      return index === 0
        ? //
          Self.state({ ctx, dispose$ })
        : Remote.state({ ctx, dispose$ });
    });

    const ctx: t.GetConnectorCtx = () => ({ peer, list });
    const renderers = Renderers.init({ ctx });
    const getRenderers: t.GetLabelItemRenderers = () => renderers;
    const list = Model.List.state({ total: 2, getItem, getRenderers });

    return { list, ctx } as const;
  },
} as const;
