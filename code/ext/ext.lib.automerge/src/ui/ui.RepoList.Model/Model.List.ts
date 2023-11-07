import { ItemModel } from './Model.Item';
import { Model, type t } from './common';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store) {
    const ctx: t.GetRepoListCtx = () => ({ list, dispatch });
    const first = ItemModel.state({ store, ctx });

    const getItem: t.GetLabelItem = (target) => {
      if (typeof target === 'number') {
        const index = target;
        if (index === 0) return [first, index];
      } else {
        /**
         * TODO 🐷
         */
      }

      return [undefined, -1];
    };

    const list = Model.List.state({ total: 1, getItem });
    const dispatch = Model.List.commands(list);

    return { ctx, list } as const;
  },
} as const;
