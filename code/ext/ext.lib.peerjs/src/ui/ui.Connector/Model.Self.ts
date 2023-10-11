import { Data } from './Model.Data';
import { renderers } from './Model.Self.render';
import { PeerUri, State, Time, slug, type t } from './common';

export type SelfArgs = SelfOptions & { ctx: t.GetConnectorCtx };
export type SelfOptions = { peerid?: string; dispose$?: t.UntilObservable };

export const Self = {
  renderers,

  init(args: SelfArgs): t.ConnectorListItem {
    return {
      state: Self.state(args),
      renderers,
    };
  },

  /**
   * State wrapper.
   */
  state(args: SelfArgs) {
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
    const state = State.item<t.ConnectorAction>(initial);
    const dispatch = State.commands(state);
    const events = state.events(args.dispose$);

    events.cmd.clipboard.copy$.subscribe(copyClipboard);
    events.cmd.action.on('local:right').subscribe(copyClipboard);

    return state;
  },

  initial(args: SelfArgs): t.ConnectorItem {
    const peerid = PeerUri.id(args.peerid) || PeerUri.generate('');
    const data: t.ConnectorDataSelf = { peerid };
    return {
      editable: false,
      label: 'self', // NB: display value overridden in renderer.
      left: { kind: 'local:left', button: false },
      right: { kind: 'local:right' },
      data: data,
    };
  },
} as const;
