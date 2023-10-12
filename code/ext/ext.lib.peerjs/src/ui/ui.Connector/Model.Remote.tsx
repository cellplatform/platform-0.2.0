import { Data } from './Data';
import { renderers } from './Model.Remote.render';
import { PeerUri, Model, Time, slug, type t } from './common';

export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = { dispose$?: t.UntilObservable };
type D = t.ConnectorDataRemote;

export const Remote = {
  init(args: RemoteArgs): t.ConnectorListItem {
    const { ctx } = args;
    return {
      state: Remote.state(args),
      renderers: renderers({ ctx }),
    };
  },

  initial(args: RemoteArgs): t.ConnectorItem<D> {
    const data: D = { kind: 'peer:remote' };
    return {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left', button: false },
      right: { kind: 'remote:right' },
      data,
    };
  },

  state(args: RemoteArgs) {
    const initial = Remote.initial(args);
    const state = Model.Item.state<t.ConnectorAction, D>(initial);
    const dispatch = Model.Item.commands(state);
    const events = state.events(args.dispose$);
    const redraw = () => dispatch.redraw();

    /**
     * Behavior: Paste
     */
    events.cmd.clipboard.paste$.subscribe(async (e) => {
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

        d.label = peerid;
        if (data.error) d.label = undefined;
      });
      redraw();
      // Time.delay(10, redraw);

      Time.delay(3000, () => {
        if (Data.remote(state).error?.tx !== tx) return;
        state.change((d) => {
          const data = Data.remote(d);
          if (data.error) data.peerid = undefined;
          data.error = undefined;
        });
        redraw();
      });
    });

    /**
     * Behavior: Connect
     */
    events.cmd.action.on('remote:right').subscribe((e) => {
      /**
       * TODO 🐷
       */
      console.log('connect', e);
    });

    /**
     * Export
     */
    return state;
  },
} as const;
