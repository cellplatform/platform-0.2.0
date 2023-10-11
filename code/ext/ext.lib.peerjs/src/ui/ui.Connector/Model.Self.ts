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
      // const uri = PeerUri.
      await navigator.clipboard.writeText(PeerUri.uri(peerid));

      const copied = `tmp.${slug()}`;
      state.change((d) => (Data.self(d).copied = copied));
      dispatch.redraw();

      Time.delay(1200, () => {
        if (Data.self(state).copied !== copied) return;
        state.change((d) => (Data.self(d).copied = undefined));
        dispatch.redraw();
      });
    };

    const initial = Self.initial(args);
    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(args.dispose$);

    events.command.clipboard.copy$.subscribe(copyClipboard);
    events.command.action.kind<t.ConnectorActionKind>('local:copy').subscribe(copyClipboard);

    return state;
  },

  initial(args: SelfArgs) {
    const peerid = PeerUri.id(args.peerid) || PeerUri.generate('');
    const data: t.ConnectorDataSelf = { peerid };
    const initial: t.ConnectorItem = {
      editable: false,
      label: '-', // NB: supress placeholder.
      left: { kind: 'local:left' },
      right: { kind: 'local:copy' },
      data: data,
    };
    return initial;
  },
} as const;
