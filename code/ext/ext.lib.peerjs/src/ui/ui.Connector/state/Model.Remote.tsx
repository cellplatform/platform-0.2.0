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
  initial(options: RemoteModelOptions = {}): t.LabelItem {
    return {
      labelRender(e) {
        return <div>{`remote:${e.item.label}`}</div>;
      },

      placeholder: 'paste remote peer',
      is: { editable: false },
      left: {
        kind: 'local:self',
        render(e) {
          return <Icons.Add size={17} color={e.color} opacity={e.enabled ? 1 : 0.3} />;
        },
      },
    };
  },
} as const;
