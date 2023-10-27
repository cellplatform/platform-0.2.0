import { Renderers } from '../ui.Connector/Renderers';
import { Remote } from './Model.Remote';
import { Self } from './Model.Self';
import { Model, rx, type t } from './common';

export const List = {
  /**
   * Initialize a new [List] controller model.
   */
  init(peer: t.PeerModel) {
    const lifecycle = rx.lifecycle(peer.dispose$);
    const { dispose$, dispose } = lifecycle;

    const array = Model.List.array((index) => {
      return index === 0
        ? //
          Self.state({ ctx, dispose$ })
        : Remote.state({ ctx, dispose$ });
    });

    const ctx: t.GetConnectorCtx = () => ({ peer, list, dispose$ });
    const renderers = Renderers.init({ ctx });
    const list = Model.List.state({
      total: 2,
      getItem: array.getItem,
      getRenderers: () => renderers,
    });

    const events = list.events(dispose$);
    events.cmd.remove$.subscribe((e) => array.remove(e.index));

    return {
      list,
      ctx,
      dispose,
      dispose$,
    } as const;
  },
} as const;
