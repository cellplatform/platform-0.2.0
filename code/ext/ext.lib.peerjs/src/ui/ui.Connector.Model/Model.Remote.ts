import { clipboardBehavior } from './Model.Remote.b.clipboard';
import { openConnectionBehavior } from './Model.Remote.b.connect';
import { Model, type t } from './common';

export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = { dispose$?: t.UntilObservable };
type D = t.ConnectorDataRemote;

export const Remote = {
  initial(args: RemoteArgs): t.ConnectorItem<D> {
    const data: D = { kind: 'peer:remote' };
    return {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left', button: false },
      right: { kind: 'remote:right' },
      data,
    };
  },

  state(args: RemoteArgs): t.ConnectorItemState {
    const { ctx } = args;
    const initial = Remote.initial(args);
    const state = Model.Item.state<t.ConnectorAction, D>(initial) as t.ConnectorItemStateRemote;
    const dispatch = Model.Item.commands(state);
    const events = state.events(args.dispose$);

    clipboardBehavior({ ctx, state, events, dispatch });
    openConnectionBehavior({ ctx, state, events, dispatch });

    return state;
  },
} as const;
