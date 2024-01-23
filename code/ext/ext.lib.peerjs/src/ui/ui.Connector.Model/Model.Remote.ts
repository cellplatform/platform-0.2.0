import { clipboardBehavior } from './Model.Remote.b.clipboard';
import { closeConnectionBehavior } from './Model.Remote.b.close';
import { openConnectionBehavior } from './Model.Remote.b.connect';
import { DEFAULTS, Model, type t } from './common';
import { Log } from './u.Log';

export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = { dispose$?: t.UntilObservable };
type D = t.ConnectorDataRemote;

export const Remote = {
  initial(args: RemoteArgs): t.ConnectorItem<D> {
    const data: D = { kind: 'peer:remote' };
    return {
      editable: true,
      left: { kind: 'remote:left', button: false },
      right: { kind: 'remote:right' },
      data,
    };
  },

  state(args: RemoteArgs): t.ConnectorItemState {
    type T = t.ConnectorItemStateRemote;
    const { ctx } = args;
    const typename = DEFAULTS.typename.remote;
    const initial = Remote.initial(args);
    const item = Model.Item.state<t.ConnectorAction, D>(initial, { typename }) as T;
    const dispatch = Model.Item.commands(item);
    const events = item.events(args.dispose$);

    clipboardBehavior({ ctx, item, events, dispatch });
    closeConnectionBehavior({ ctx, item, events, dispatch });
    openConnectionBehavior({ ctx, item, events, dispatch });

    events.key.on(
      (e) => e.code === 'KeyP',
      (e) => Log.item('🙊 Remote', ctx().peer, item),
    );

    return item;
  },
} as const;
