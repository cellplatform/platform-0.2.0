import { Data } from './Data';
import { renderers } from './Model.Item.render';
import { Model, rx, type t } from './common';

export type ItemModelArgs = { store: t.Store; ctx: t.GetRepoListCtx; dispose$?: t.UntilObservable };

type D = t.RepoItemData;

export const ItemModel = {
  init(args: ItemModelArgs) {
    const { ctx } = args;
    return {
      state: ItemModel.state(args),
      renderers: renderers({ ctx }),
    };
  },

  initial(args: ItemModelArgs): t.RepoItem {
    const data: D = { mode: 'Add' };
    return {
      editable: false,
      label: '',
      left: { kind: 'Store:Left' },
      data,
    };
  },

  /**
   * State wrapper.
   */
  state(args: ItemModelArgs) {
    const { store } = args;
    const initial = ItemModel.initial(args);
    const state = Model.item<t.RepoListAction, D>(initial);
    const dispatch = Model.commands(state);
    const events = state.events(args.dispose$);

    /**
     * Behavior.
     */
    const add = () => {
      const ctx = args.ctx();
      console.log('add', store);
      state.change((d) => {
        const data = Data.item(d);
        data.mode = 'Doc';
      });

      dispatch.redraw();

      ctx.list.change((d) => {
        const next = ItemModel.state(args);
        d.items.push(next);
      });
    };

    const mode = () => Data.item(state).mode;
    const addModeFilter = rx.filter(() => mode() === 'Add');
    events.key.enter$.pipe(addModeFilter).subscribe(add);
    events.cmd.action.on('Store:Left').pipe(addModeFilter).subscribe(add);
    events.cmd.click$
      .pipe(rx.filter((e) => e.kind === 'Double'))
      .pipe(rx.filter((e) => e.target === 'Item'))
      .subscribe(add);

    return state;
  },
} as const;