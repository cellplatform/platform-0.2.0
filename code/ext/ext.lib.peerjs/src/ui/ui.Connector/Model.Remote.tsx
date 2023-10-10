import { State, type t } from './common';
import { renderers, type TData } from './Model.Remote.renderers';

export type { TData };
export type RemoteArgs = RemoteOptions & { ctx: t.GetConnectorCtx };
export type RemoteOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const Remote = {
  renderers,

  init(args: RemoteArgs): t.ConnectorListItem {
    return {
      state: Remote.state(args),
      renderers,
    };
  },

  state(args: RemoteArgs) {
    const { dispose$ } = args;
    const initial: t.ConnectorItem = {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left' },
    };

    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(dispose$);

    /**
     * Behavior: Paste
     */
    events.command.clipboard.paste$.subscribe(async (e) => {
      const id = await navigator.clipboard.readText();
      state.change((d) => (d.label = id));
      dispatch.redraw();

      const ctx = args.ctx();
      console.log('ctx', ctx);
    });

    return state;
  },
} as const;
