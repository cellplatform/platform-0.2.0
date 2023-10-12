import { PatchState, State, type t } from './common';
import { ItemModel } from './Model.Item';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store) {
    const ctx: t.GetStoreCtx = () => ({ list });
    const first = ItemModel.init({ store, ctx });
    const renderers = first.renderers;
    const initial: t.StoreList = {
      state: State.list(),
      items: [first.state],
    };
    const list = PatchState.init<t.StoreList>({ initial });
    return { list, renderers };
  },
} as const;
