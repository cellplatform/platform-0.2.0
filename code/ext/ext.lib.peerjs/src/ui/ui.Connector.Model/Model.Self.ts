import { Data } from './Data';
import { Model, PeerUri, Time, slug, type t } from './common';

export type SelfArgs = SelfOptions & { ctx: t.GetConnectorCtx };
export type SelfOptions = { peerid?: string; dispose$?: t.UntilObservable };
type D = t.ConnectorDataSelf;

export const Self = {
  initial(args: SelfArgs): t.ConnectorItem<D> {
    const peerid = PeerUri.id(args.peerid) || PeerUri.generate('');
    const data: D = { kind: 'peer:self', peerid };
    return {
      editable: false,
      label: 'self', // NB: display value overridden in renderer.
      left: { kind: 'self:left', button: false },
      right: { kind: 'self:right' },
      data,
    };
  },

  /**
   * State wrapper.
   */
  state(args: SelfArgs): t.ConnectorItemState {
    const copyClipboard = async () => {
      const peerid = Data.self(state).peerid;
      await navigator.clipboard.writeText(PeerUri.uri(peerid));

      const tx = slug();
      state.change((d) => (Data.self(d).copied = tx));
      dispatch.redraw();

      Time.delay(1200, () => {
        if (Data.self(state).copied !== tx) return;
        state.change((d) => (Data.self(d).copied = undefined));
        dispatch.redraw();
      });
    };

    const initial = Self.initial(args);
    const state = Model.Item.state<t.ConnectorAction, D>(initial);
    const dispatch = Model.Item.commands(state);
    const events = state.events(args.dispose$);

    events.cmd.clipboard.copy$.subscribe(copyClipboard);
    events.cmd.action.on('self:right').subscribe(copyClipboard);

    return state;
  },
} as const;
