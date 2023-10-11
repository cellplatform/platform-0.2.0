import { Data } from './Model.Data';
import { renderers } from './Model.Remote.render';
import { PeerUri, State, slug, type t, Time } from './common';

export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = { dispose$?: t.UntilObservable };

export const Remote = {
  renderers,

  init(args: RemoteArgs): t.ConnectorListItem {
    return {
      state: Remote.state(args),
      renderers,
    };
  },

  state(args: RemoteArgs) {
    const initial = Remote.initial(args);
    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(args.dispose$);

    /**
     * Behavior: Paste
     */
    events.command.clipboard.paste$.subscribe(async (e) => {
      const ctx = args.ctx();
      const tx = slug();

      const pasted = (await navigator.clipboard.readText()).trim();
      const isValid = PeerUri.Is.peerid(pasted) || PeerUri.Is.uri(pasted);
      const peerid = isValid ? PeerUri.id(pasted) : '';

      const self = Data.self(ctx.list.current.items[0].state);
      const isSelf = self.peerid === peerid;

      state.change((d) => {
        const data = Data.remote(d);
        data.peerid = peerid;

        if (!isValid) data.error = { type: 'InvalidPeer', tx };
        else if (isSelf) data.error = { type: 'PeerIsSelf', tx };
        else data.error = undefined;

        d.label = undefined;
        if (data.error) d.label = undefined;
        else d.label = peerid;
      });
      dispatch.redraw();

      Time.delay(2500, () => {
        if (Data.remote(state).error?.tx !== tx) return;
        state.change((d) => (Data.remote(d).error = undefined));
        dispatch.redraw();
      });
    });

    return state;
  },

  initial(args: RemoteArgs) {
    const initial: t.ConnectorItem = {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left' },
      right: { kind: 'remote:right' },
    };
    return initial;
  },
} as const;
