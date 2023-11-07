import { ItemModel } from './Model.Item';
import { addBehavior } from './Model.Item.b.add';
import { Model, rx, type t } from './common';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store, options: { dispose$?: t.UntilObservable } = {}) {
    const lifecycle = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = lifecycle;

    const ctx: t.GetRepoListCtx = () => ({ list, dispatch, dispose$ });

    const array = Model.List.array((index) => {
      return ItemModel.state({ store, ctx });
    });

    const list = Model.List.state({ total: 1, getItem: array.getItem });
    const dispatch = Model.List.commands(list);

    addBehavior({ list, array, dispose$ });

    return {
      ctx,
      list,
      dispose,
      dispose$,
    } as const;
  },
} as const;
