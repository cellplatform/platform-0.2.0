import { Data } from './Data';
import { renderers } from './Model.Self.render';
import { PeerUri, State, Time, slug, type t } from './common';

export type SelfArgs = SelfOptions & { ctx: t.GetConnectorCtx };
export type SelfOptions = { peerid?: string; dispose$?: t.UntilObservable };
type D = t.ConnectorDataSelf;

export const Self = {
  init(args: SelfArgs): t.ConnectorListItem {
    const { ctx } = args;
    return {
      state: Self.state(args),
      renderers: renderers({ ctx }),
    };
  },

  initial(args: SelfArgs): t.ConnectorItem<D> {
    const peerid = PeerUri.id(args.peerid) || PeerUri.generate('');
    const data: D = { kind: 'peer:self', peerid };
    return {
      editable: false,
      label: 'self', // NB: display value overridden in renderer.
      left: { kind: 'local:left', button: false },
      right: { kind: 'local:right' },
      data,
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
    const state = State.item<t.ConnectorAction, D>(initial);
    const dispatch = State.commands(state);
    const events = state.events(args.dispose$);

    events.cmd.clipboard.copy$.subscribe(copyClipboard);
    events.cmd.action.on('local:right').subscribe(copyClipboard);

    return state;
  },
} as const;
