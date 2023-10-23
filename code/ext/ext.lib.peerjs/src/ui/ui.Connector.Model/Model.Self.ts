import { clipboardBehavior } from './Model.Self.b.clipboard';
import { Model, PeerUri, type t } from './common';

export type SelfArgs = SelfOptions & { ctx: t.GetConnectorCtx };
export type SelfOptions = { peerid?: string; dispose$?: t.UntilObservable };
type D = t.ConnectorDataSelf;

export const Self = {
  initial(args: SelfArgs): t.ConnectorItem<D> {
    const localid = PeerUri.id(args.peerid) || PeerUri.generate('');
    const data: D = { kind: 'peer:self', localid };
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

    return state;
  },
} as const;
