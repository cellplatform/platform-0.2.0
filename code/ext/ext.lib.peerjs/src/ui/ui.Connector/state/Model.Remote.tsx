import { Icons, State, type t } from '../common';

export type RemoteModelOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const RemoteModel = {
  /**
   * State wrapper.
   */
  state(options: RemoteModelOptions = {}) {
    const { dispose$ } = options;
    const model = RemoteModel.initial(options);
    const state = State.item(model);
    const dispatch = State.commands(state);
    const events = state.events(dispose$);

    events.command.clipboard.paste$.subscribe(async (e) => {
      console.log('💥 paste');
      const id = await navigator.clipboard.readText();
      state.change((d) => (d.label = id));
      dispatch.redraw();
    });

    return state;
  },

  /**
   * Base model.
   */
  initial(options: RemoteModelOptions = {}): t.ConnectorItem {
    return {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left' },
    };
  },

  get renderers(): t.ConnectorItemRenderers {
    return {
      label(e) {
        return <div>{`remote:${e.item.label}`}</div>;
      },

      action(kind, helpers) {
        if (kind === 'remote:left') {
          return (e) => <Icons.Add {...helpers.icon(e, 17)} />;
        }
        return;
      },
    };
  },
} as const;
