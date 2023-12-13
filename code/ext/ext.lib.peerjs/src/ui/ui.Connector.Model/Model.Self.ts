import { clipboardBehavior } from './Model.Self.b.clipboard';
import { peerBehavior } from './Model.Self.b.peer';
import { purgeBehavior } from './Model.Self.b.purge';
import { DEFAULTS, Model, type t } from './common';
import { Log } from './u.Log';

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
    type T = t.ConnectorItemStateSelf;
    const { ctx } = args;
    const type = DEFAULTS.type.self;
    const initial = Self.initial(args);
    const item = Model.Item.state<t.ConnectorAction, D>(initial, { type }) as T;
    const dispatch = Model.Item.commands(item);
    const events = item.events(args.dispose$);

    clipboardBehavior({ ctx, item, events, dispatch });
    peerBehavior({ ctx, item, events, dispatch });
    purgeBehavior({ ctx, item, events, dispatch });

    events.key.on(
      (e) => e.code === 'KeyP',
      (e) => Log.item('🫠 Self', ctx().peer, item),
    );

    return item;
  },
} as const;
