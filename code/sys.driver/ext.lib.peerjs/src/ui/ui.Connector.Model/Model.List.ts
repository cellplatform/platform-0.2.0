import { Renderers } from '../ui.Connector/Renderers';
import { Remote } from './Model.Remote';
import { Self } from './Model.Self';
import { DEFAULTS, Model, rx, type t } from './common';
import { peerMonitor } from './Model.List.b.peerMonitor';

export const List = {
  /**
   * Initialize a new [List] controller model.
   */
  init(peer: t.PeerModel, options: { dispose$?: t.UntilObservable } = {}) {
    const lifecycle = rx.lifecycle([peer.dispose$, options.dispose$]);
    const { dispose$, dispose } = lifecycle;

    const array = Model.List.array((index) => {
      return index === 0
        ? //
          Self.state({ ctx, dispose$ })
        : Remote.state({ ctx, dispose$ });
    });

    const ctx: t.GetConnectorCtx = () => ({ peer, list, dispose$ });
    const renderers = Renderers.init({ ctx });
    const list = Model.List.state(
      {
        total: 2,
        getItem: array.getItem,
        getRenderers: () => renderers,
      },
      { typename: DEFAULTS.typename.list },
    );

    const events = list.events(dispose$);
    events.cmd.remove$.subscribe((e) => array.remove(e.index));

    peerMonitor({ peer, list, array, dispose$ });

    return {
      list,
      ctx,
      dispose,
      dispose$,
    } as const;
  },
} as const;
