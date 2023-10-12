import { PatchState, Model, type t } from './common';
import { ItemModel } from './Model.Item';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  init(store: t.Store) {
    const ctx: t.GetRepoListCtx = () => ({ list });
    const first = ItemModel.init({ store, ctx });
    const renderers = first.renderers;
    const initial: t.RepoList = {
      state: Model.list(),
      items: [first.state],
    };
    const list = PatchState.init<t.RepoList>({ initial });
    return { list, renderers };
  },
} as const;
