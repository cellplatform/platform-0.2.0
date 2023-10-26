import { clipboardBehavior } from './Model.Self.b.clipboard';
import { peerBehavior } from './Model.Self.b.peer';
import { Model, type t } from './common';
import { purgeBehavior } from './Model.Self.b.purge';

export type SelfOptions = { dispose$?: t.UntilObservable };
export type SelfArgs = SelfOptions & { ctx: t.GetConnectorCtx };
type D = t.ConnectorDataSelf;

export const Self = {
  initial(args: SelfArgs): t.ConnectorItem<D> {
    const peer = args.ctx().peer;
    const data: D = { kind: 'peer:self', peerid: peer.id };
    return {
      editable: false,
      label: 'self', // NB: display value overridden in renderer.
      left: { kind: 'self:left', button: false },
      right: { kind: 'self:right' },
      data,
    };
  },

  state(args: SelfArgs): t.ConnectorItemState {
    const { ctx } = args;
    const initial = Self.initial(args);
    const state = Model.Item.state<t.ConnectorAction, D>(initial) as t.ConnectorItemStateSelf;
    const dispatch = Model.Item.commands(state);
    const events = state.events(args.dispose$);

    clipboardBehavior({ ctx, state, events, dispatch });
    peerBehavior({ ctx, state, events, dispatch });
    purgeBehavior({ ctx, state, events, dispatch });

    return state;
  },
} as const;
