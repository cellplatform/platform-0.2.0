import { ItemModel } from './Model.Item';
import { Model, rx, type t, DEFAULTS } from './common';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store, options: { dispose$?: t.UntilObservable } = {}) {
    const lifecycle = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = lifecycle;

    const ctx: t.RepoListCtxGet = () => ({ list, store, dispatch, dispose$ });

    const array = Model.List.array((index) => {
      return ItemModel.state({ ctx });
    });

    const list: t.RepoListState = Model.List.state(
      { total: 1, getItem: array.getItem },
      { type: DEFAULTS.typename.list },
    );
    const dispatch = Model.List.commands(list);

    return {
      ctx,
      list,
      dispatch,
      dispose,
      dispose$,
    } as const;
  },
} as const;
