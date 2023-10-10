import { PeerUri, slug, State, Time, type t } from './common';
import { renderers, getData, type TData } from './Model.Self.renderers';

export type SelfOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const Self = {
  renderers,

  /**
   * State wrapper.
   */
  state(options: SelfOptions = {}) {
    const { dispose$ } = options;
    const peerid = PeerUri.id(options.peerid) || PeerUri.generate('');
    const peeruri = PeerUri.prepend(peerid);

    const copyClipboard = async () => {
      await navigator.clipboard.writeText(peeruri);

      const copied = slug();
      state.change((d) => (getData(d).copied = copied));
      dispatch.redraw();

      Time.delay(1200, () => {
        if (getData(state.current).copied !== copied) return;
        state.change((d) => (getData(d).copied = undefined));
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
