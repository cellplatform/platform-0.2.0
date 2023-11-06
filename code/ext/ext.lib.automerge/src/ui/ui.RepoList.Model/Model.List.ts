import { PatchState, Model, type t } from './common';
import { ItemModel } from './Model.Item';
import { renderers } from './Model.Item.render';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store) {
    const ctx: t.GetRepoListCtx = () => ({ list, dispatch });
    const first = ItemModel.init({ store, ctx });

    const getItem: t.GetLabelItem = (target) => {
      if (typeof target === 'number') {
        const index = target;
        if (index === 0) return [first.state, index];
      } else {
        /**
         * TODO 🐷
         */
      }

      return [undefined, -1];
    };

    const list = Model.List.state({ total: 1, getItem });
    const dispatch = Model.List.commands(list);

    return {
      ctx,
      list,
      renderers: renderers({ ctx }),
    } as const;
  },
} as const;
