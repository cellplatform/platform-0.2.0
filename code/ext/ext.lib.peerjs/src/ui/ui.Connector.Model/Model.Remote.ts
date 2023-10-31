import { clipboardBehavior } from './Model.Remote.b.clipboard';
import { closeConnectionBehavior } from './Model.Remote.b.close';
import { openConnectionBehavior } from './Model.Remote.b.connect';
import { selectionBehavior } from './Model.Remote.b.selection';
import { DEFAULTS, Model, type t } from './common';

export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = { dispose$?: t.UntilObservable };
type D = t.ConnectorDataRemote;

export const Remote = {
  initial(args: RemoteArgs): t.ConnectorItem<D> {
    const data: D = { kind: 'peer:remote' };
    return {
      editable: true,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left', button: false },
      right: { kind: 'remote:right' },
      data,
    };
  },

  state(args: RemoteArgs): t.ConnectorItemState {
    type T = t.ConnectorItemStateRemote;
    const { ctx } = args;
    const type = DEFAULTS.type.remote;
    const initial = Remote.initial(args);
    const state = Model.Item.state<t.ConnectorAction, D>(initial, { type }) as T;
    const dispatch = Model.Item.commands(state);
    const events = state.events(args.dispose$);

    selectionBehavior({ ctx, state, events, dispatch });
    clipboardBehavior({ ctx, state, events, dispatch });
    closeConnectionBehavior({ ctx, state, events, dispatch });
    openConnectionBehavior({ ctx, state, events, dispatch });

    return state;
  },
} as const;
