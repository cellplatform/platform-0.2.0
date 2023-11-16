import { ItemModel } from './Model.Item';
import { GetItem } from './Model.List.GetItem';
import { DEFAULTS, Model, WebStore, rx, type t } from './common';

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  async init(store: t.WebStore, options: { dispose$?: t.UntilObservable } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;
    const index = await WebStore.index(store);
    const total = index.doc.current.docs.length + 1;

    /**
     * Model.
     */
    const ctx: t.RepoListCtxGet = () => ({ list, store, index, dispose$ });
    const array = Model.List.array((i) => ItemModel.state({ ctx }));
    const getItem = GetItem(index, array);
    const state: t.RepoListState = Model.List.state(
      { total, getItem },
      { type: DEFAULTS.typename.List, dispose$ },
    );

    /**
     * API.
     */
    const dispatch = Model.List.commands(state);
    const list = { state, dispatch };
    const api: t.RepoListModel = {
      ctx,
      store,
      index,
      list,

      /**
       * Lifecycle.
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },
} as const;
