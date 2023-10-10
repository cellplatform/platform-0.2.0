import { PeerUri, slug, State, Time, type t } from './common';
import { renderers, type TData } from './Model.Self.renderers';

export type SelfModelOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const SelfModel = {
  renderers,

  /**
   * State wrapper.
   */
  state(options: SelfModelOptions = {}) {
    const { dispose$ } = options;
    const peerid = PeerUri.id(options.peerid) || PeerUri.generate('');
    const peeruri = PeerUri.prepend(peerid);

    const copyClipboard = async () => {
      await navigator.clipboard.writeText(peeruri);

      const copied = slug();
      state.change((d) => (State.data<TData>(d).copied = copied));
      dispatch.redraw();

      Time.delay(1200, () => {
        if (State.data<TData>(state.current).copied !== copied) return;
        state.change((d) => (State.data<TData>(d).copied = undefined));
        dispatch.redraw();
      });
    };

    const initial: t.ConnectorItem = {
      editable: false,
      placeholder: 'peer id',
      label: peerid,
      left: { kind: 'local:left' },
      right: { kind: 'local:copy' },
    };

    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(dispose$);

    events.command.clipboard.copy$.subscribe(copyClipboard);
    events.command.action.kind<t.ConnectorActionKind>('local:copy').subscribe(copyClipboard);

    return state;
  },
} as const;
