import { Icons, State, type t } from './common';
import { renderers, type TData } from './Model.Remote.renderers';

export type RemoteOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const Remote = {
  renderers,

  /**
   * State wrapper.
   */
  state(options: RemoteOptions = {}) {
    const { dispose$ } = options;

    const initial: t.ConnectorItem = {
      editable: false,
      placeholder: 'paste remote peer',
      left: { kind: 'remote:left' },
    };

    // const model = Remote.initial(options);
    const state = State.item(initial);
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

  // /**
  //  * Base model.
  //  */
  // initial(options: RemoteOptions = {}): t.ConnectorItem {
  //   return {
  //     editable: false,
  //     placeholder: 'paste remote peer',
  //     left: { kind: 'remote:left' },
  //   };
  // },
} as const;
